import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { GameGroupApiService } from '@app/api/game-group/game-group.api.service';
import { GameGroupResponseData } from '@app/api/game-group/game-group.api.types';
import { ApiErrorResponse } from '@app/core/types';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { InputButtonComponent } from '@app/shared/components/form/input-button/input-button.component';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GameGroupNavigationComponent } from '../../components/game-group-navigation/game-group-navigation.component';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-game-group-search',
  imports: [CommonModule, TranslateModule, MatIconModule, TooltipComponent, ReactiveFormsModule, RouterModule, InputButtonComponent, GameGroupNavigationComponent],
  templateUrl: './game-group-search.page.html',
})
export class GameGroupSearchPage implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly gameGroupApiService = inject(GameGroupApiService);
  private readonly toastService = inject(ToastService);

  gameGroups = signal<GameGroupResponseData[]>([]);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  pageSize = signal<number>(10);
  
  searchControl = new FormControl('');
  currentSearchTerm = signal<string>('');

  ngOnInit(): void {
    this.loadGameGroups();
    this.setupSearchSubscription();
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.currentSearchTerm.set(searchTerm || '');
        this.loadGameGroups(0, searchTerm || '');
      });
  }

  public async loadGameGroups(page: number = 0, searchTerm: string = ''): Promise<void> {
    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(
        this.gameGroupApiService.search(
          page, 
          this.pageSize(), 
          searchTerm || undefined,
        ),
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
        this.translate.instant('PAGE.GAME_GROUP.SEARCH.LOAD_ERROR');
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

  public onPageChange(page: number): void {
    this.loadGameGroups(page, this.currentSearchTerm());
  }

  public clearSearch(): void {
    this.searchControl.setValue('');
    this.currentSearchTerm.set('');
    this.loadGameGroups();
  }

  onManualSearch(searchTerm: string | null): void {
    if (searchTerm && searchTerm.trim()) {
      this.performSearch(searchTerm.trim());
    }
  }

  private performSearch(searchTerm: string): void {
    this.currentSearchTerm.set(searchTerm);
    this.loadGameGroups(0, searchTerm);
  }
}