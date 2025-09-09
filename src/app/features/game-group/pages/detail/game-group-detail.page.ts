import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { Observable, map, shareReplay } from 'rxjs';

import { GameGroupApiService } from '../../../../api/game-group/game-group.api.service';
import { GameGroupResponseData, GameGroupMember } from '../../../../api/game-group/game-group.api.types';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { TextareaComponent } from '@app/shared/components/form/textarea/textarea.component';
import { NumberInputComponent } from '@app/shared/components/form/number-input/number-input.component';

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
    NumberInputComponent
],
  providers: [provideMarkdown()],
  templateUrl: './game-group-detail.page.html'
})
export class GameGroupDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private gameGroupService = inject(GameGroupApiService);
  private translateService = inject(TranslateService);

  gameGroup$!: Observable<GameGroupResponseData>;
  sortedParticipants$!: Observable<GameGroupMember[]>;
  descriptionControl = new FormControl('');
  isEditingDescription = false;
  
  
  isEditingEssentialInfo = false;
  essentialInfoForm = new FormGroup({
    campaignName: new FormControl('', [Validators.required]),
    gameSystem: new FormControl('', [Validators.required]),
    settingWorld: new FormControl(''),
    shortDescription: new FormControl('', [Validators.required]),
    minPlayers: new FormControl<number | null>(null, [Validators.min(1)]),
    maxPlayers: new FormControl<number | null>(null, [Validators.min(1)])
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gameGroup$ = this.gameGroupService.getById(id).pipe(
        map(response => {
          if (response.data) {
            this.descriptionControl.setValue(response.data.description || '');
            return response.data;
          }
          throw new Error(this.translateService.instant('COMMON.GAME_GROUP_NOT_FOUND'));
        }),
        shareReplay(1)
      );

      this.sortedParticipants$ = this.gameGroup$.pipe(
        map(gameGroup => {
          if (!gameGroup.participants) return [];
          
          const participants = [...gameGroup.participants];
          
          return participants.sort((a, b) => {
            
            if (a.role === 'MASTER' && b.role !== 'MASTER') return -1;
            if (b.role === 'MASTER' && a.role !== 'MASTER') return 1;
            
            
            return a.username.localeCompare(b.username);
          });
        })
      );
    }
  }

  toggleDescriptionEdit(): void {
    this.isEditingDescription = !this.isEditingDescription;
  }

  saveDescription(): void {
    
    
    this.isEditingDescription = false;
  }

  cancelDescriptionEdit(): void {
    
    this.isEditingDescription = false;
    
  }

  get descriptionContent(): string {
    return this.descriptionControl.value || '';
  }
  
  
  toggleEssentialInfoEdit(): void {
    this.isEditingEssentialInfo = !this.isEditingEssentialInfo;
    
    if (this.isEditingEssentialInfo) {
      
      this.gameGroup$.subscribe(gameGroup => {
        this.essentialInfoForm.patchValue({
          campaignName: gameGroup.campaignName,
          gameSystem: gameGroup.gameSystem,
          settingWorld: gameGroup.settingWorld || '',
          shortDescription: gameGroup.shortDescription,
          minPlayers: gameGroup.minPlayers || null,
          maxPlayers: gameGroup.maxPlayers || null
        });
      });
    }
  }
  
  saveEssentialInfo(): void {
    if (this.essentialInfoForm.valid) {
      
      this.isEditingEssentialInfo = false;
    }
  }
  
  cancelEssentialInfoEdit(): void {
    this.isEditingEssentialInfo = false;
    this.essentialInfoForm.reset();
  }


}
