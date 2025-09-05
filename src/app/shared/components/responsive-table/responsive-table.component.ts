import { Component, Input, TemplateRef, ContentChild, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { TooltipComponent } from '../tooltip/tooltip.component';


export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  mobileLabel?: string; 
}

export interface TableAction {
  label: string;
  icon?: string;
  action: (item: Record<string, unknown>) => void;
  visible?: (item: Record<string, unknown>) => boolean;
}

@Component({
  selector: 'app-responsive-table',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, TooltipComponent],
  templateUrl: './responsive-table.component.html'
})
export class ResponsiveTableComponent implements OnDestroy {
  @Input() data: Record<string, unknown>[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'Nenhum registro encontrado';
  @Input() trackByFn?: (index: number, item: Record<string, unknown>) => unknown;
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() striped = true;
  @Input() hover = true;
  @Input() responsive = true;

  @ContentChild('cellTemplate') cellTemplate?: TemplateRef<unknown>;
  @ContentChild('actionTemplate') actionTemplate?: TemplateRef<unknown>;

  
  isMobile = signal(false);
  private readonly resizeHandler = () => this.checkScreenSize();

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  private checkScreenSize(): void {
    this.isMobile.set(window.innerWidth < 768); 
  }

  getColumnValue(item: Record<string, unknown>, column: TableColumn): unknown {
    return this.getNestedProperty(item, column.key);
  }

  private getNestedProperty(obj: Record<string, unknown>, path: string): unknown {
    const keys = path.split('.');
    let result: unknown = obj;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && result !== null) {
        result = (result as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    
    return result;
  }

  trackByIndex(index: number): number {
    return index;
  }

  getVisibleActions(item: Record<string, unknown>): TableAction[] {
    return this.actions.filter(action => !action.visible || action.visible(item));
  }

  executeAction(action: TableAction, item: Record<string, unknown>): void {
    action.action(item);
  }

  getButtonClass(icon: string): string {
    const iconColorMap: { [key: string]: string } = {
      'edit': 'edit text-primary',
      'toggle_on': 'toggle_on text-warning',
      'toggle_off': 'toggle_off text-warning',
      'mail': 'mail text-info',
      'delete': 'delete text-danger'
    };
    
    return iconColorMap[icon] || 'btn-primary';
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }
}