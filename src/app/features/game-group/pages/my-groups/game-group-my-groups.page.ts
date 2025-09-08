import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GameGroupApiService } from '@app/api/game-group/game-group.api.service';
import { GameGroupResponseData } from '@app/api/game-group/game-group.api.types';
import { ApiErrorResponse } from '@app/core/types';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-game-group-my-groups',
  imports: [CommonModule, TranslateModule, MatIconModule, TooltipComponent],
  templateUrl: './game-group-my-groups.page.html',
})
export class GameGroupMyGroupsPage implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly gameGroupApiService = inject(GameGroupApiService);
  private readonly toastService = inject(ToastService);

  gameGroups = signal<GameGroupResponseData[]>([]);
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
      const response = await firstValueFrom(
        this.gameGroupApiService.myGroups(page, this.pageSize(), [
          'campaignName,asc',
          'createdAt,desc',
        ]),
      );
      if (response?.data) {
        this.gameGroups.set(response.data.content);
        this.currentPage.set(response.data.page.number);
        this.totalPages.set(response.data.page.totalPages);
        this.totalElements.set(response.data.page.totalElements);
      }
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError.error?.message ||
        apiError.message ||
        this.translate.instant('PAGE.USER_LIST.LOAD_ERROR');
      this.toastService.danger(errorMessage);
    } finally {
      this.isLoading.set(false);
    }
  }

  public getAccessRuleIcon(accessRule: string): string {
    switch (accessRule) {
      case 'FREE':
        return 'mdi-lock-open-variant';
      case 'FRIENDS':
        return 'mdi-lock-open';
      case 'APPROVAL':
        return 'mdi-lock';
      case 'PRIVATE':
        return 'mdi-lock';
      default:
        return 'mdi-lock';
    }
  }
}
