import { Injectable, signal } from '@angular/core';

export interface ConfirmationModalConfig {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationModalService {
  private readonly modal = signal<ConfirmationModalConfig | null>(null);
  private idCounter = 0;

  getModal = this.modal.asReadonly();

  private generateId(): string {
    return `confirmation-modal-${++this.idCounter}-${Date.now()}`;
  }

  show(config: Omit<ConfirmationModalConfig, 'id'>): string {
    const id = this.generateId();
    const modalConfig: ConfirmationModalConfig = {
      id,
      title: config.title,
      message: config.message,
      confirmText: config.confirmText ?? 'Confirmar',
      cancelText: config.cancelText ?? 'Cancelar',
      confirmButtonClass: config.confirmButtonClass ?? 'btn-success',
      cancelButtonClass: config.cancelButtonClass ?? 'btn-secondary',
      onConfirm: config.onConfirm,
      onCancel: config.onCancel
    };
    
    this.modal.set(modalConfig);
    return id;
  }

  hide(): void {
    this.modal.set(null);
  }

  confirm(): void {
    const currentModal = this.modal();
    if (currentModal) {
      currentModal.onConfirm();
      this.hide();
    }
  }

  cancel(): void {
    const currentModal = this.modal();
    if (currentModal) {
      currentModal.onCancel?.();
      this.hide();
    }
  }

  
  showDanger(title: string, message: string, onConfirm: () => void, onCancel?: () => void): string {
    return this.show({
      title,
      message,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-danger',
      cancelButtonClass: 'btn-secondary',
      onConfirm,
      onCancel
    });
  }

  showWarning(title: string, message: string, onConfirm: () => void, onCancel?: () => void): string {
    return this.show({
      title,
      message,
      confirmText: 'Continuar',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-warning',
      cancelButtonClass: 'btn-secondary',
      onConfirm,
      onCancel
    });
  }

  showInfo(title: string, message: string, onConfirm: () => void, onCancel?: () => void): string {
    return this.show({
      title,
      message,
      confirmText: 'OK',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-primary',
      cancelButtonClass: 'btn-secondary',
      onConfirm,
      onCancel
    });
  }
}