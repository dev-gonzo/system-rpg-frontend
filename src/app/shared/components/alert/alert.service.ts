import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'danger' | 'info' | 'warning';

export interface AlertMessage {
  id: string;
  message: string;
  type: AlertType;
  closable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly alerts = signal<AlertMessage[]>([]);
  private idCounter = 0;

getAlerts = this.alerts.asReadonly();

  private generateId(): string {
    return `alert-${++this.idCounter}-${Date.now()}`;
  }

  show(message: string, type: AlertType = 'info', closable = true): string {
    const id = this.generateId();
    const alert: AlertMessage = { id, message, type, closable };
    
    this.alerts.update(alerts => [...alerts, alert]);
    
    return id;
  }

  remove(id: string): void {
    this.alerts.update(alerts => alerts.filter(alert => alert.id !== id));
  }

  clear(): void {
    this.alerts.set([]);
  }

  success(message: string, closable = true): string {
    return this.show(message, 'success', closable);
  }

  danger(message: string, closable = true): string {
    return this.show(message, 'danger', closable);
  }

  info(message: string, closable = true): string {
    return this.show(message, 'info', closable);
  }

  warning(message: string, closable = true): string {
    return this.show(message, 'warning', closable);
  }
}