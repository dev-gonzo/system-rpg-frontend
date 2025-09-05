import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(type: ToastType): string {
    const baseClasses = 'border-start border-5';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-success-subtle border-success text-success-emphasis`;
      case 'danger':
        return `${baseClasses} bg-danger-subtle border-danger text-danger-emphasis`;
      case 'warning':
        return `${baseClasses} bg-warning-subtle border-warning text-warning-emphasis`;
      case 'info':
        return `${baseClasses} bg-info-subtle border-info text-info-emphasis`;
      default:
        return `${baseClasses} bg-info-subtle border-info text-info-emphasis`;
    }
  }

  getIconClass(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }

  closeToast(id: string): void {
    this.toastService.remove(id);
  }
}