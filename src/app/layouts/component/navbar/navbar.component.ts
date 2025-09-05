import { Component, EventEmitter, Output, Input, inject, HostListener } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { ThemeState } from '@app/design/theme/theme.state';
import { AccessibilityControlsComponent } from '@app/shared/components/accessibility-controls/accessibility-controls.component';
import { AuthApiService } from '@app/api/auth/auth.api.service';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { AuthService } from '@app/auth/service/auth.service';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [AccessibilityControlsComponent, TranslateModule, TooltipComponent, MatIconModule],
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() isSidebarOpen = false;

  isUserDropdownOpen = false;
  


  theme = inject(ThemeState);
  private readonly auth = inject(AuthService);
  private readonly authService = inject(AuthApiService);
  private readonly toastService = inject(ToastService);

  toggleTheme(): void {
    this.theme.toggleTheme();
  }

  increaseFont(): void {
    this.theme.adjustFontSize('increase');
  }

  decreaseFont(): void {
    this.theme.adjustFontSize('decrease');
  }

  resetFont(): void {
    this.theme.resetFontSize();
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  goToProfile(event: Event): void {
    event.preventDefault();
    this.isUserDropdownOpen = false;
    
    
  }

  logout(event: Event): void {
    event.preventDefault();
    this.isUserDropdownOpen = false;
    
    this.authService.logout().subscribe({
      next: () => {
        this.auth.logout();
      },
      error: () => {
        this.toastService.show('Erro ao fazer logout', 'danger');
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');
    
    if (!dropdown && this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }
}
