import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toasts = signal<ToastMessage[]>([]);
  private idCounter = 0;

getToasts = this.toasts.asReadonly();

  private generateId(): string {
    return `toast-${++this.idCounter}-${Date.now()}`;
  }

  show(message: string, type: ToastType = 'info', autoClose = true): string {
    const id = this.generateId();
    const toast: ToastMessage = { id, message, type };
    
    this.toasts.update(toasts => [...toasts, toast]);
    
    if (autoClose) {
      setTimeout(() => this.remove(id), 5000);
    }
    
    return id;
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }

  success(message: string, autoClose = true): string {
    return this.show(message, 'success', autoClose);
  }

  danger(message: string, autoClose = true): string {
    return this.show(message, 'danger', autoClose);
  }

  info(message: string, autoClose = true): string {
    return this.show(message, 'info', autoClose);
  }

  warning(message: string, autoClose = true): string {
    return this.show(message, 'warning', autoClose);
  }
}