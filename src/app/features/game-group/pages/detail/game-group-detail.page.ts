import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { Observable, map, shareReplay } from 'rxjs';

import { GameGroupApiService } from '../../../../api/game-group/game-group.api.service';
import { GameGroupResponseData, GameGroupMember } from '../../../../api/game-group/game-group.api.types';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';

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
    SectionWrapperComponent
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


}
