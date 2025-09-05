import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem, MENU_ITEMS } from '../../../core/constants/menu-items.constant';

@Component({
  selector: 'app-spacer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './spacer-sidebar.component.html',
  styleUrls: ['./spacer-sidebar.component.scss']
})
export class SpacerSidebarComponent {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  menuItems: MenuItem[] = MENU_ITEMS;
  @Input() isExpanded = true;





}