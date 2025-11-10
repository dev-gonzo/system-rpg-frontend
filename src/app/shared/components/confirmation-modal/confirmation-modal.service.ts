import { Injectable, signal } from '@angular/core';

export interface ConfirmationModalConfig {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  onConfirm: (value?: string) => void;
  onCancel?: () => void;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel';
  inputInitialValue?: string;
  inputMode?: 'text' | 'autocomplete';
  onSearch?: (query: string) => Promise<{ label: string; value: string | number }[]> | import('rxjs').Observable<{ label: string; value: string | number }[]> | { label: string; value: string | number }[];
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
      onCancel: config.onCancel,
      inputLabel: config.inputLabel,
      inputPlaceholder: config.inputPlaceholder,
      inputType: config.inputType,
      inputInitialValue: config.inputInitialValue,
      inputMode: config.inputMode ?? 'text',
      onSearch: config.onSearch
    };
    
    this.modal.set(modalConfig);
    return id;
  }

  hide(): void {
    this.modal.set(null);
  }

  confirm(value?: string): void {
    const currentModal = this.modal();
    if (currentModal) {
      currentModal.onConfirm(value);
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