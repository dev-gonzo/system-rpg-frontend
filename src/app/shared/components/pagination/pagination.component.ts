import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

export interface PaginationInfo {
  start: number;
  end: number;
  total: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  
  @Input() currentPage = signal(0);
  @Input() totalPages = signal(0);
  @Input() pageSize = signal(10);
  @Input() totalElements = signal(0);
  @Input() isLoading = signal(false);
  @Input() isDarkMode = signal(false);
  @Input() showInfo = signal(true);
  @Input() translationKey = signal('PAGE.PAGINATION_INFO');

  
  @Output() pageChange = new EventEmitter<number>();

  
  readonly showPagination = computed(() => 
    !this.isLoading() && this.totalPages() > 1
  );

  readonly paginationInfo = computed((): PaginationInfo => ({
    start: this.currentPage() * this.pageSize() + 1,
    end: Math.min((this.currentPage() + 1) * this.pageSize(), this.totalElements()),
    total: this.totalElements()
  }));

  readonly isPreviousDisabled = computed(() => this.currentPage() === 0);
  
  readonly isNextDisabled = computed(() => 
    this.currentPage() === this.totalPages() - 1
  );

  readonly pages = computed(() => 
    Array.from({ length: this.totalPages() }, (_, i) => i)
  );

  
  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  onPreviousPage(): void {
    if (!this.isPreviousDisabled()) {
      this.onPageChange(this.currentPage() - 1);
    }
  }

  onNextPage(): void {
    if (!this.isNextDisabled()) {
      this.onPageChange(this.currentPage() + 1);
    }
  }

  isActivePage(page: number): boolean {
    return page === this.currentPage();
  }

  
  Math = Math;
}