import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationModalService } from './confirmation-modal.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
  confirmationModalService = inject(ConfirmationModalService);

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    event.preventDefault();
    this.cancel();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
    }
  }

  confirm(): void {
    this.confirmationModalService.confirm();
  }

  cancel(): void {
    this.confirmationModalService.cancel();
  }

  getConfirmButtonClasses(buttonClass?: string): string {
    const baseClasses = 'btn';
    return `${baseClasses} ${buttonClass ?? 'btn-primary'}`;
  }

  getCancelButtonClasses(buttonClass?: string): string {
    const baseClasses = 'btn';
    return `${baseClasses} ${buttonClass ?? 'btn-secondary'}`;
  }
}