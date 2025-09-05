import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, HostListener } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { ThemeState } from '@app/design/theme/theme.state';
import { AlertComponent } from '@app/shared/components/alert/alert.component';
import { ToastComponent } from '@app/shared/components/toast/toast.component';
import { DesktopSidebarComponent } from '../component/desktop-sidebar/desktop-sidebar.component';
import { FooterComponent } from '../component/footer/footer.component';
import { MobileMenuComponent } from '../component/mobile-menu/mobile-menu.component';
import { NavbarComponent } from '../component/navbar/navbar.component';
import { SpacerSidebarComponent } from '../component/spacer-sidebar/spacer-sidebar.component';

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    NavbarComponent,
    FooterComponent,
    MobileMenuComponent,
    SpacerSidebarComponent,
    DesktopSidebarComponent,
    AlertComponent,
    ToastComponent
],
  templateUrl: './layout-main.component.html',
})
export class LayoutMainComponent implements OnInit {
  isSidebarOpen = false;
  isSidebarExpanded = true;
  readonly theme = inject(ThemeState);
  private readonly MOBILE_BREAKPOINT = 800;

  ngOnInit(): void {
    const savedState = localStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      this.isSidebarExpanded = savedState === 'true';
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    const target = event.target as Window;
    if (target.innerWidth > this.MOBILE_BREAKPOINT && this.isSidebarOpen) {
      this.closeMobileMenu();
    }
  }

  toggleDesktopSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;

    localStorage.setItem('sidebar-expanded', this.isSidebarExpanded.toString());
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMobileMenu(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeMobileMenu(): void {
    this.isSidebarOpen = false;
  }

  onSidebarStateChange(isExpanded: boolean): void {
    this.isSidebarExpanded = isExpanded;

    localStorage.setItem('sidebar-expanded', this.isSidebarExpanded.toString());
  }
}
