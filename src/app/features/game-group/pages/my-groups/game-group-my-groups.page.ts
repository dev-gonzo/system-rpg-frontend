import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { GameGroupApiService } from '@app/api/game-group/game-group.api.service';
import { GameGroupResponseData } from '@app/api/game-group/game-group.api.types';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-game-group-my-groups',
  imports: [CommonModule, TranslateModule],
  templateUrl: './game-group-my-groups.page.html',
})
export class GameGroupMyGroupsPage implements OnInit {
  private readonly gameGroupApiService = inject(GameGroupApiService);

  gameGroup = signal<GameGroupResponseData[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  pageSize = signal<number>(10);

  ngOnInit(): void {
    this.loadMyGroups();
  }

  public async loadMyGroups(page: number = 0): Promise<void> {
    this.isLoading.set(true);

    try {
      await firstValueFrom(
        this.gameGroupApiService.myGroups(page, this.pageSize(), [
          'campaignName,asc',
          'createdAt,desc',
        ]),
      );
    } catch {
      
      void 0;
    } finally {
      this.isLoading.set(false);
    }
  }
}
