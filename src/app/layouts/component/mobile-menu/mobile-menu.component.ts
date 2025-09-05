import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem, MENU_ITEMS } from '../../../core/constants/menu-items.constant';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatIconModule],
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() menuItemClick = new EventEmitter<MenuItem>();

  menuItems: MenuItem[] = MENU_ITEMS;

  onMenuItemClick(item: MenuItem): void {
    this.menuItemClick.emit(item);
    this.closeMenu.emit();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu.emit();
    }
  }

  onBackdropClick(): void {
    this.closeMenu.emit();
  }

  onSettingsClick(): void {
    this.closeMenu.emit();
  }

  getIconName(iconClass: string): string {
    const iconMap: { [key: string]: string } = {
      'computer': 'computer',
    'videocam': 'videocam',
    'upload': 'upload',
    'business': 'business'
    };
    
    return iconMap[iconClass] || 'computer';
  }
}