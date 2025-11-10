import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { Observable, map, shareReplay, BehaviorSubject, catchError, of } from 'rxjs';

import { InputComponent } from '@app/shared/components/form/input/input.component';
import { NumberInputComponent } from '@app/shared/components/form/number-input/number-input.component';
import { RadioComponent } from '@app/shared/components/form/radio/radio.component';
import { SelectComponent } from '@app/shared/components/form/select/select.component';
import { TextareaComponent } from '@app/shared/components/form/textarea/textarea.component';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { ConfirmationModalService } from '@app/shared/components/confirmation-modal/confirmation-modal.service';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { AdventureApiService } from '../../../../api/adventure/adventure.api.service';
import { AdventureResponseData } from '../../../../api/adventure/adventure.api.types';
import { GameGroupApiService } from '../../../../api/game-group/game-group.api.service';
import { GameGroupMember, GameGroupResponseData } from '../../../../api/game-group/game-group.api.types';
import { GameGroupPartialUpdate } from '../../types/game-group-update.types';
import { UsersApiService } from '../../../../api/users/users.api.service';
import { AuthService } from '../../../../auth/service/auth.service';
import { AuthResponse } from '../../../../api/auth/auth.api.types';

@Component({
  standalone: true,
  selector: 'app-game-group-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MarkdownComponent,
    MatIconModule,
    TooltipComponent,
    SectionWrapperComponent,
    InputComponent,
    TextareaComponent,
    NumberInputComponent,
    RadioComponent,
    SelectComponent
],
  providers: [provideMarkdown()],
  templateUrl: './game-group-detail.page.html'
})
export class GameGroupDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameGroupService = inject(GameGroupApiService);
  private translate = inject(TranslateService);
  private confirmationModalService = inject(ConfirmationModalService);
  private toastService = inject(ToastService);
  private adventureApiService = inject(AdventureApiService);
  private usersApiService = inject(UsersApiService);
  private authService = inject(AuthService);
  
  @ViewChild('rulesSection') rulesSection!: ElementRef;
  
  private gameGroupId!: string;
  private originalFormValues: Record<string, unknown> = {};
  private updateInProgress = false;
  private updateTimeout: number | null = null;
  
  
  isUpdatingStatus = false;
  isDeletingGroup = false;
  isDropdownOpen = false;
  adventures: AdventureResponseData[] = [];

  private gameGroupSubject = new BehaviorSubject<GameGroupResponseData | null>(null);
  gameGroup$ = this.gameGroupSubject.asObservable().pipe(
    map(gameGroup => gameGroup!),
    shareReplay(1)
  );
  sortedParticipants$!: Observable<GameGroupMember[]>;
  descriptionControl = new FormControl('');
  isEditingDescription = false;
  private originalDescription = '';
  private currentUserId: string | null = null;
  
  
  isEditingEssentialInfo = false;
  essentialInfoForm = new FormGroup({
    campaignName: new FormControl('', [Validators.required]),
    gameSystem: new FormControl('', [Validators.required]),
    settingWorld: new FormControl(''),
    shortDescription: new FormControl('', [Validators.required]),
    maxPlayers: new FormControl<number | null>(null, [Validators.min(1)]),
    visibility: new FormControl('', [Validators.required]),
    accessRule: new FormControl('', [Validators.required]),
    modality: new FormControl('', [Validators.required])
  });

  isEditingRules = false;
  rulesForm = new FormGroup({
    themesContent: new FormControl(''),
    punctualityAttendance: new FormControl(''),
    houseRules: new FormControl(''),
    behavioralExpectations: new FormControl('')
  });

  ngOnInit(): void {
    const gameGroupId = this.route.snapshot.paramMap.get('id');
    
    if (gameGroupId) {
      this.gameGroupId = gameGroupId;
      this.loadGameGroup();
      this.loadAdventures();
    }

    const user = this.authService.currentUser() as AuthResponse['user'] | null;
    this.currentUserId = user?.id ?? null;
  }

  toggleDescriptionEdit(): void {
    if (!this.isEditingDescription) {
      this.originalDescription = this.descriptionControl.value || '';
    } else {
      
      this.descriptionControl.setValue(this.originalDescription);
    }
    this.isEditingDescription = !this.isEditingDescription;
  }

  navigateToAdventureCreate(): void {
    if (!this.gameGroupId) return;
    this.router.navigate(['/game-groups', this.gameGroupId, 'adventures', 'create']);
  }

  loadAdventures(): void {
    if (!this.gameGroupId) return;
    this.adventureApiService
      .listByGroup(this.gameGroupId)
      .subscribe({
        next: (response) => {
          const data: unknown = response.data;
          if (Array.isArray(data)) {
            this.adventures = data as AdventureResponseData[];
          } else {
            const wrapper = data as { content?: AdventureResponseData[] };
            this.adventures = wrapper?.content ?? [];
          }
        },
        error: () => {
          this.adventures = [];
        },
      });
  }

  editAdventure(adventure: AdventureResponseData): void {
    this.router.navigate(['/adventures/update', adventure.id]);
  }

  deleteAdventure(adventure: AdventureResponseData): void {
    this.confirmationModalService.showDanger(
      'Excluir aventura',
      'Esta ação não pode ser desfeita. Tem certeza que deseja excluir permanentemente esta aventura?',
      () => {
        this.adventureApiService.delete(adventure.id).subscribe({
          next: () => {
            this.toastService.success('Aventura excluída!');
            this.loadAdventures();
          },
          error: () => {
            this.toastService.danger('Falha ao excluir a aventura');
          },
        });
      }
    );
  }

  openAddParticipantModal(): void {
    if (!this.gameGroupId) return;
    if (!this.canManageParticipants()) {
      this.toastService.danger('Apenas o mestre pode incluir participantes.');
      return;
    }
    this.confirmationModalService.show({
      title: 'Incluir participante',
      message: '',
      confirmText: 'Incluir',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-primary',
      inputLabel: 'Usuário',
      inputPlaceholder: 'Digite para buscar usuário',
      inputMode: 'autocomplete',
      onSearch: (query: string) => {
        const term = (query ?? '').trim();
        if (!term) return of([]);
        return this.usersApiService.searchUsers({ q: term, size: 10 }).pipe(
          map(resp => (resp.data?.content ?? []).map(u => ({
            label: `${u.username}${(u.firstName || u.lastName) ? ' - ' + [u.firstName, u.lastName].filter(Boolean).join(' ') : ''}`,
            value: u.id
          }))),
          catchError(err => {
            if (err?.status === 403) {
              this.toastService.danger('Sem permissão para buscar usuários.');
            } else {
              this.toastService.danger('Falha ao buscar usuários.');
            }
            return of([]);
          })
        );
      },
      onConfirm: (value?: string) => {
        const userId = (value ?? '').trim();
        if (!userId) {
          this.toastService.danger('Selecione um usuário válido.');
          return;
        }
        this.gameGroupService.addParticipant(this.gameGroupId, userId).subscribe({
          next: () => {
            this.toastService.success('Participante incluído com sucesso!');
            this.loadGameGroup();
          },
          error: (err) => {
            if (err?.status === 403) {
              this.toastService.danger('Apenas o mestre pode incluir participantes.');
            } else if (err?.status === 404) {
              this.toastService.danger('Grupo ou usuário não encontrado.');
            } else {
              this.toastService.danger('Falha ao incluir participante.');
            }
          }
        });
      }
    });
  }

  removeParticipant(participant: GameGroupMember): void {
    if (!this.gameGroupId) return;
    if (!this.canManageParticipants()) {
      this.toastService.danger('Apenas o mestre pode remover participantes.');
      return;
    }
    this.confirmationModalService.showDanger(
      'Remover participante',
      `Tem certeza que deseja remover ${participant.username}?`,
      () => {
        this.gameGroupService.removeParticipant(this.gameGroupId, participant.id).subscribe({
          next: () => {
            this.toastService.success('Participante removido.');
            this.loadGameGroup();
          },
          error: (err) => {
            if (err?.status === 403) {
              this.toastService.danger('Apenas o mestre pode remover participantes.');
            } else if (err?.status === 404) {
              this.toastService.danger('Grupo ou usuário não encontrado.');
            } else {
              this.toastService.danger('Falha ao remover participante.');
            }
          }
        });
      }
    );
  }

  deactivateParticipant(participant: GameGroupMember): void {
    if (!this.gameGroupId) return;
    if (!this.canManageParticipants()) {
      this.toastService.danger('Apenas o mestre pode desativar participantes.');
      return;
    }
    this.confirmationModalService.show(
      {
        title: 'Desativar participante',
        message: `Deseja desativar ${participant.username}?`,
        onConfirm: () => {
          this.gameGroupService.getParticipantId(this.gameGroupId, participant.id).subscribe({
            next: (participantId) => {
              if (!participantId) {
                this.toastService.danger('Participante não encontrado ou removido.');
                return;
              }
              this.gameGroupService.deactivateParticipantById(this.gameGroupId, participantId).subscribe({
                next: () => {
                  this.toastService.success('Status do participante atualizado.');
                  this.loadGameGroup();
                },
                error: (err) => {
                  if (err?.status === 404) {
                    this.toastService.danger('Participante não encontrado.');
                  } else if (err?.status === 403) {
                    this.toastService.danger('Apenas o mestre pode desativar participantes.');
                  } else {
                    this.toastService.danger('Falha ao desativar participante.');
                  }
                }
              });
            },
            error: () => {
              this.toastService.danger('Falha ao localizar participante.');
            }
          });
        }
      }
    );
  }

  isCreator(): boolean {
    const createdById = this.gameGroupSubject.value?.createdBy?.id || null;
    return !!this.currentUserId && !!createdById && this.currentUserId === createdById;
  }

  canManageParticipants(): boolean {
    const group = this.gameGroupSubject.value;
    const currentUserId = this.currentUserId;
    if (!group || !currentUserId) return false;
    return (group.participants ?? []).some(p => p.id === currentUserId && p.role === 'MASTER');
  }

  onDescriptionBlur(): void {
    const currentValue = this.descriptionControl.value || '';
    const originalValue = this.originalDescription;
    
    if (this.hasValueChanged(originalValue, currentValue)) {
      this.updateField('description', currentValue);
      this.originalDescription = currentValue;
    }
  }

  get descriptionContent(): string {
    return this.descriptionControl.value || '';
  }
  


  visibilityOptions = [
    { label: this.translate.instant('COMMON.VISIBILITY.PUBLIC'), value: 'public' },
    { label: this.translate.instant('COMMON.VISIBILITY.PRIVATE'), value: 'private' }
  ];

  accessRuleOptions = [
    { label: this.translate.instant('COMMON.ACCESS_RULE.FREE'), value: 'free' },
    { label: this.translate.instant('COMMON.ACCESS_RULE.FRIENDS'), value: 'friends' },
    { label: this.translate.instant('COMMON.ACCESS_RULE.APPROVAL'), value: 'approval' }
  ];

  modalityOptions = [
    { label: this.translate.instant('COMMON.MODALITY.ONLINE'), value: 'online' },
    { label: this.translate.instant('COMMON.MODALITY.PRESENCIAL'), value: 'presential' }
  ];

  getModalityLabel(modality: string): string {
    switch(modality) {
      case 'ONLINE':
        return this.translate.instant('COMMON.MODALITY.ONLINE');
      case 'PRESENTIAL':
        return this.translate.instant('COMMON.MODALITY.PRESENCIAL');
      default:
        return modality;
    }
  }
  
  
  toggleEssentialInfoEdit(): void {
    this.isEditingEssentialInfo = !this.isEditingEssentialInfo;
    
    if (this.isEditingEssentialInfo) {
      this.gameGroup$.subscribe(gameGroup => {
        
        const mapVisibility = (value: string) => {
          switch(value) {
            case 'PUBLIC': return 'public';
            case 'PRIVATE': return 'private';
            default: return '';
          }
        };
        
        const mapAccessRule = (value: string) => {
          switch(value) {
            case 'FREE': return 'free';
            case 'FRIENDS': return 'friends';
            case 'APPROVAL': return 'approval';
            default: return '';
          }
        };
        
        const mapModality = (value: string) => {
          switch(value) {
            case 'ONLINE': return 'online';
            case 'PRESENTIAL': return 'presential';
            default: return '';
          }
        };
        
        const formValues = {
         campaignName: gameGroup.campaignName || '',
         gameSystem: gameGroup.gameSystem || '',
         settingWorld: gameGroup.settingWorld || '',
         shortDescription: gameGroup.shortDescription || '',
         maxPlayers: gameGroup.maxPlayers || null,
         visibility: mapVisibility(gameGroup.visibility || ''),
         accessRule: mapAccessRule(gameGroup.accessRule || ''),
         modality: mapModality(gameGroup.modality || '')
       };
        
        
        this.essentialInfoForm.get('campaignName')?.setValue(formValues.campaignName);
        this.essentialInfoForm.get('gameSystem')?.setValue(formValues.gameSystem);
        this.essentialInfoForm.get('settingWorld')?.setValue(formValues.settingWorld);
        this.essentialInfoForm.get('shortDescription')?.setValue(formValues.shortDescription);
        this.essentialInfoForm.get('maxPlayers')?.setValue(formValues.maxPlayers);
        this.essentialInfoForm.get('visibility')?.setValue(formValues.visibility);
        this.essentialInfoForm.get('accessRule')?.setValue(formValues.accessRule);
        this.essentialInfoForm.get('modality')?.setValue(formValues.modality);
        
        this.originalFormValues = { ...formValues };
      });
    }
  }

  toggleRulesEdit(): void {
    this.isEditingRules = !this.isEditingRules;
    
    if (this.isEditingRules) {
      this.gameGroup$.subscribe(gameGroup => {
        const rulesFormValues = {
          themesContent: gameGroup.themesContent || '',
          punctualityAttendance: gameGroup.punctualityAttendance || '',
          houseRules: gameGroup.houseRules || '',
          behavioralExpectations: gameGroup.behavioralExpectations || ''
        };
        
        this.rulesForm.get('themesContent')?.setValue(rulesFormValues.themesContent);
        this.rulesForm.get('punctualityAttendance')?.setValue(rulesFormValues.punctualityAttendance);
        this.rulesForm.get('houseRules')?.setValue(rulesFormValues.houseRules);
        this.rulesForm.get('behavioralExpectations')?.setValue(rulesFormValues.behavioralExpectations);
        
        this.originalFormValues = { ...rulesFormValues };
      });
    } else {
      
      setTimeout(() => {
        if (this.rulesSection) {
          this.rulesSection.nativeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  }
  
  onFieldBlur(fieldName: string): void {
    if (!this.originalFormValues) {
      return;
    }
    
    if (this.updateInProgress) {
      return;
    }
    
    let currentValue = this.essentialInfoForm.get(fieldName)?.value;
    if (currentValue === undefined) {
      currentValue = this.rulesForm.get(fieldName)?.value;
    }
    const originalValue = this.originalFormValues[fieldName];
    
    if (this.hasValueChanged(originalValue, currentValue)) {
      this.updateField(fieldName, currentValue);
    }
  }

  onFieldChange(fieldName: string): void {
    if (!this.originalFormValues) {
      return;
    }
    
    if (this.updateInProgress) {
      return;
    }
    
    let currentValue = this.essentialInfoForm.get(fieldName)?.value;
    if (currentValue === undefined) {
      currentValue = this.rulesForm.get(fieldName)?.value;
    }
    const originalValue = this.originalFormValues[fieldName];
    
    if (this.hasValueChanged(originalValue, currentValue)) {
      this.updateField(fieldName, currentValue);
    }
  }
  
  private hasValueChanged(originalValue: unknown, newValue: unknown): boolean {
    const normalizeValue = (value: unknown) => {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return value;
    };
    
    const normalizedOriginal = normalizeValue(originalValue);
    const normalizedNew = normalizeValue(newValue);
    
    return normalizedOriginal !== normalizedNew;
  }
  
  private updateField(fieldName: string, newValue: unknown): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = window.setTimeout(() => {
      this.performUpdate(fieldName, newValue);
    }, 300);
  }
  
  private performUpdate(fieldName: string, newValue: unknown): void {
    if (this.updateInProgress) {
      return;
    }
    
    this.updateInProgress = true;
    
    
    const mapFormValueToApi = (field: string, value: unknown) => {
      if (field === 'visibility') {
        switch(value) {
          case 'public': return 'PUBLIC';
          case 'private': return 'PRIVATE';
          default: return value;
        }
      }
      if (field === 'accessRule') {
        switch(value) {
          case 'free': return 'FREE';
          case 'friends': return 'FRIENDS';
          case 'approval': return 'APPROVAL';
          default: return value;
        }
      }
      if (field === 'modality') {
        switch(value) {
          case 'online': return 'ONLINE';
          case 'presential': return 'PRESENTIAL';
          default: return value;
        }
      }
      return value;
    };
    
    const updateValue = mapFormValueToApi(fieldName, newValue);
    
    const updateData: GameGroupPartialUpdate = {
      [fieldName]: updateValue
    };
    
    this.gameGroupService.update(this.gameGroupId, updateData).subscribe({
      next: () => {
        this.originalFormValues[fieldName] = newValue;
        if (fieldName === 'description') {
          this.originalDescription = newValue as string;
        }
        
        this.updateLocalGameGroup(fieldName, newValue);
        this.updateInProgress = false;
      },
      error: () => {
        if (fieldName === 'description') {
          this.descriptionControl.setValue(this.originalDescription, { emitEvent: false });
        } else {
          this.essentialInfoForm.get(fieldName)?.setValue(this.originalFormValues[fieldName], { emitEvent: false });
          this.rulesForm.get(fieldName)?.setValue(this.originalFormValues[fieldName], { emitEvent: false });
        }
        this.updateInProgress = false;
      }
    });
  }
  
  private loadGameGroup(): void {
    this.gameGroupService.getById(this.gameGroupId).subscribe({
      next: (response) => {
        if (response.data) {
          const description = response.data.description || '';
          this.descriptionControl.setValue(description);
          this.originalDescription = description;
          this.originalFormValues['description'] = description;
          
          
          this.gameGroupSubject.next(response.data);
          
          
          this.sortedParticipants$ = this.gameGroup$.pipe(
            map(gameGroup => {
              if (!gameGroup.participants) {
                return [];
              }
              
              return gameGroup.participants.sort((a, b) => {
                if (a.role === 'MASTER' && b.role !== 'MASTER') return -1;
                if (b.role === 'MASTER' && a.role !== 'MASTER') return 1;
                
                return a.username.localeCompare(b.username);
              });
            })
          );
        } else {
          throw new Error(this.translate.instant('COMMON.GAME_GROUP_NOT_FOUND'));
        }
      },
      error: (_error: unknown) => {
        return;
      }
    });
  }
  
  private updateLocalGameGroup(fieldName: string, newValue: unknown): void {
    const currentGameGroup = this.gameGroupSubject.value;
    if (currentGameGroup) {
      const updatedGameGroup = { ...currentGameGroup };
      (updatedGameGroup as Record<string, unknown>)[fieldName] = newValue;
      this.gameGroupSubject.next(updatedGameGroup);
    }
  }

  
  toggleGameGroupStatus(): void {
    if (this.isUpdatingStatus) return;
    
    this.isDropdownOpen = false;
    
    
    this.gameGroup$.subscribe(gameGroup => {
      const isCurrentlyActive = gameGroup.isActive;
      const actionText = isCurrentlyActive ? 'inativar' : 'ativar';
      const title = `Confirmar ${actionText} mesa`;
      const message = `Tem certeza que deseja ${actionText} esta mesa de jogo?`;
      
      this.confirmationModalService.show({
        title,
        message,
        onConfirm: () => {
          this.performStatusUpdate(!isCurrentlyActive);
        }
      });
    }).unsubscribe();
  }
  
  private performStatusUpdate(newStatus: boolean): void {
    this.isUpdatingStatus = true;
    
    this.gameGroupService.updateGameGroupStatus(this.gameGroupId, { isActive: newStatus }).subscribe({
      next: () => {
        
        this.updateLocalGameGroup('isActive', newStatus);
        this.isUpdatingStatus = false;
      },
      error: (_error: unknown) => {
        this.isUpdatingStatus = false;
      }
    });
  }

  
  deleteGameGroup(): void {
    if (this.isDeletingGroup) return;
    
    this.isDropdownOpen = false;
    
    this.confirmationModalService.showDanger(
      'Excluir mesa de jogo',
      'Esta ação não pode ser desfeita. Tem certeza que deseja excluir permanentemente esta mesa de jogo?',
      () => {
        this.performDelete();
      }
    );
  }
  
  private performDelete(): void {
    this.isDeletingGroup = true;
    
    this.gameGroupService.deleteGameGroup(this.gameGroupId).subscribe({
      next: () => {
        
        window.location.href = '/game-groups/my-groups';
      },
      error: (_error: unknown) => {
        this.isDeletingGroup = false;
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');
    
    if (!dropdown && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

}
