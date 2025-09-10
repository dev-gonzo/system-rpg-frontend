import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { Observable, map, shareReplay } from 'rxjs';

import { InputComponent } from '@app/shared/components/form/input/input.component';
import { NumberInputComponent } from '@app/shared/components/form/number-input/number-input.component';
import { RadioComponent } from '@app/shared/components/form/radio/radio.component';
import { SelectComponent } from '@app/shared/components/form/select/select.component';
import { TextareaComponent } from '@app/shared/components/form/textarea/textarea.component';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { ConfirmationModalService } from '@app/shared/components/confirmation-modal/confirmation-modal.service';
import { GameGroupApiService } from '../../../../api/game-group/game-group.api.service';
import { GameGroupMember, GameGroupResponseData } from '../../../../api/game-group/game-group.api.types';
import { GameGroupPartialUpdate } from '../../types/game-group-update.types';

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
  private gameGroupService = inject(GameGroupApiService);
  private translate = inject(TranslateService);
  private confirmationModalService = inject(ConfirmationModalService);
  
  @ViewChild('rulesSection') rulesSection!: ElementRef;
  
  private gameGroupId!: string;
  private originalFormValues: Record<string, unknown> = {};
  updateInProgress = false;
  private updateTimeout: number | null = null;
  
  
  isUpdatingStatus = false;
  isDeletingGroup = false;
  isDropdownOpen = false;

  gameGroup$!: Observable<GameGroupResponseData>;
  sortedParticipants$!: Observable<GameGroupMember[]>;
  descriptionControl = new FormControl('');
  isEditingDescription = false;
  private originalDescription = '';
  
  
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
    }
  }

  toggleDescriptionEdit(): void {
    if (!this.isEditingDescription) {
      this.originalDescription = this.descriptionControl.value || '';
    } else {
      
      this.descriptionControl.setValue(this.originalDescription);
    }
    this.isEditingDescription = !this.isEditingDescription;
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
  
  get currentCampaignName(): string {
    return this.essentialInfoForm.get('campaignName')?.value || '';
  }

  get currentThemesContent(): string {
    const formValue = this.rulesForm.get('themesContent')?.value;
    if (formValue !== null && formValue !== undefined) {
      return formValue;
    }
    
    let gameGroupValue = '';
    this.gameGroup$.subscribe(gameGroup => {
      gameGroupValue = gameGroup.themesContent || '';
    }).unsubscribe();
    return gameGroupValue;
  }

  get currentPunctualityAttendance(): string {
    const formValue = this.rulesForm.get('punctualityAttendance')?.value;
    if (formValue !== null && formValue !== undefined) {
      return formValue;
    }
    let gameGroupValue = '';
    this.gameGroup$.subscribe(gameGroup => {
      gameGroupValue = gameGroup.punctualityAttendance || '';
    }).unsubscribe();
    return gameGroupValue;
  }

  get currentHouseRules(): string {
    const formValue = this.rulesForm.get('houseRules')?.value;
    if (formValue !== null && formValue !== undefined) {
      return formValue;
    }
    let gameGroupValue = '';
    this.gameGroup$.subscribe(gameGroup => {
      gameGroupValue = gameGroup.houseRules || '';
    }).unsubscribe();
    return gameGroupValue;
  }

  get currentBehavioralExpectations(): string {
    const formValue = this.rulesForm.get('behavioralExpectations')?.value;
    if (formValue !== null && formValue !== undefined) {
      return formValue;
    }
    let gameGroupValue = '';
    this.gameGroup$.subscribe(gameGroup => {
      gameGroupValue = gameGroup.behavioralExpectations || '';
    }).unsubscribe();
    return gameGroupValue;
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

  hasRulesChanges(): boolean {
    const currentValues = {
      themesContent: this.rulesForm.get('themesContent')?.value || '',
      punctualityAttendance: this.rulesForm.get('punctualityAttendance')?.value || '',
      houseRules: this.rulesForm.get('houseRules')?.value || '',
      behavioralExpectations: this.rulesForm.get('behavioralExpectations')?.value || ''
    };

    return Object.keys(currentValues).some(key => 
      this.hasValueChanged(this.originalFormValues[key], currentValues[key as keyof typeof currentValues])
    );
  }

  saveRulesChanges(): void {
    if (this.updateInProgress || !this.hasRulesChanges()) {
      return;
    }

    this.updateInProgress = true;

    const currentValues = {
      themesContent: this.rulesForm.get('themesContent')?.value || '',
      punctualityAttendance: this.rulesForm.get('punctualityAttendance')?.value || '',
      houseRules: this.rulesForm.get('houseRules')?.value || '',
      behavioralExpectations: this.rulesForm.get('behavioralExpectations')?.value || ''
    };

    const updateData = {} as GameGroupPartialUpdate;
      
      Object.keys(currentValues).forEach(key => {
        if (this.hasValueChanged(this.originalFormValues[key], currentValues[key as keyof typeof currentValues])) {
          Object.assign(updateData, { [key]: currentValues[key as keyof typeof currentValues] });
        }
      });

    this.gameGroupService.update(this.gameGroupId, updateData).subscribe({
      next: () => {
        this.originalFormValues = { ...currentValues };
        this.isEditingRules = false;
        this.updateInProgress = false;
        
        setTimeout(() => {
          if (this.rulesSection) {
            this.rulesSection.nativeElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
      },
      error: () => {
        this.updateInProgress = false;
      }
    });
  }

  cancelRulesEdit(): void {
    this.gameGroup$.subscribe(gameGroup => {
      const originalValues = {
        themesContent: gameGroup.themesContent || '',
        punctualityAttendance: gameGroup.punctualityAttendance || '',
        houseRules: gameGroup.houseRules || '',
        behavioralExpectations: gameGroup.behavioralExpectations || ''
      };
      
      this.rulesForm.get('themesContent')?.setValue(originalValues.themesContent);
      this.rulesForm.get('punctualityAttendance')?.setValue(originalValues.punctualityAttendance);
      this.rulesForm.get('houseRules')?.setValue(originalValues.houseRules);
      this.rulesForm.get('behavioralExpectations')?.setValue(originalValues.behavioralExpectations);
      
      this.originalFormValues = { ...originalValues };
      this.isEditingRules = false;
      
      setTimeout(() => {
        if (this.rulesSection) {
          this.rulesSection.nativeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    });
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
        this.updateInProgress = false;
      },
      error: () => {
        if (fieldName === 'description') {
          this.descriptionControl.setValue(this.originalDescription, { emitEvent: false });
        } else {
          this.essentialInfoForm.get(fieldName)?.setValue(this.originalFormValues[fieldName], { emitEvent: false });
        }
        this.updateInProgress = false;
      }
    });
  }
  
  private loadGameGroup(): void {
    this.gameGroup$ = this.gameGroupService.getById(this.gameGroupId).pipe(
      map(response => {
        if (response.data) {
          const description = response.data.description || '';
          this.descriptionControl.setValue(description);
          this.originalDescription = description;
          this.originalFormValues['description'] = description;
          return response.data;
        }
        throw new Error(this.translate.instant('COMMON.GAME_GROUP_NOT_FOUND'));
      }),
      shareReplay(1)
    );
    
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
        
        this.loadGameGroup();
        this.isUpdatingStatus = false;
      },
      error: () => {
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
      error: () => {
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
