import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  MenuItem,
  MENU_ITEMS,
} from '../../../core/constants/menu-items.constant';
import { TooltipComponent } from '../../../shared/components/tooltip/tooltip.component';

@Component({
  selector: 'app-desktop-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TranslateModule, TooltipComponent],
  templateUrl: './desktop-sidebar.component.html',
  styleUrls: ['./desktop-sidebar.component.scss'],
})
export class DesktopSidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = MENU_ITEMS;
  isExpanded = true;

  private readonly STORAGE_KEY = 'sidebar-expanded';

  ngOnInit(): void {
    this.loadSidebarState();

    this.sidebarStateChange.emit(this.isExpanded);
  }

  private loadSidebarState(): void {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      this.isExpanded = savedState === 'true';
    }
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
    localStorage.setItem('sidebar-expanded', this.isExpanded.toString());
    this.sidebarStateChange.emit(this.isExpanded);
  }

  onMenuItemClick(_item: MenuItem): void {
    return;
  }

  onSettingsClick(): void {
    return;
  }

}
