import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { HateoasLink } from '@app/core/types/hateoas';
import { UserData } from '@app/api/users/users.api.types';

export interface ActionButtonConfig {
  action: string;
  icon: string;
  tooltipKey: string;
  buttonClass: string;
  condition?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-action-buttons',
  imports: [CommonModule, MatIconModule, TranslateModule, TooltipComponent],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.scss'
})
export class ActionButtonsComponent {
  @Input() actions: HateoasLink[] = [];
  @Input() item!: UserData;
  @Output() actionClick = new EventEmitter<{ action: string; item: UserData }>();

  private readonly actionConfigs: Record<string, ActionButtonConfig> = {
    'edit': {
      action: 'edit',
      icon: 'edit',
      tooltipKey: 'PAGE.USER_LIST.ACTIONS.EDIT',
      buttonClass: 'btn-outline-primary'
    },
    'toggle-status': {
      action: 'toggle-status',
      icon: 'play_arrow',
      tooltipKey: 'PAGE.USER_LIST.ACTIONS.ACTIVATE',
      buttonClass: 'btn-outline-success'
    },
    'verify-email': {
      action: 'verify-email',
      icon: 'mark_email_read',
      tooltipKey: 'PAGE.USER_LIST.ACTIONS.VERIFY_EMAIL',
      buttonClass: 'btn-outline-info',
      condition: true
    },
    'delete': {
      action: 'delete',
      icon: 'delete',
      tooltipKey: 'PAGE.USER_LIST.ACTIONS.DELETE',
      buttonClass: 'btn-outline-danger'
    }
  };

  hasAction(action: string): boolean {
    return this.actions.some(link => link.rel === action);
  }

  getActionConfig(action: string): ActionButtonConfig | null {
    return this.actionConfigs[action] || null;
  }

  getToggleStatusConfig(): ActionButtonConfig {
    const isActive = this.item?.isActive;
    return {
      action: 'toggle-status',
      icon: isActive ? 'pause' : 'play_arrow',
      tooltipKey: isActive ? 'PAGE.USER_LIST.ACTIONS.DEACTIVATE' : 'PAGE.USER_LIST.ACTIONS.ACTIVATE',
      buttonClass: isActive ? 'btn-outline-warning' : 'btn-outline-success'
    };
  }

  shouldShowVerifyEmail(): boolean {
    return this.hasAction('verify-email') && !this.item?.isEmailVerified;
  }

  onActionClick(action: string): void {
    this.actionClick.emit({ action, item: this.item });
  }

  getVisibleActions(): string[] {
    const visibleActions: string[] = [];
    
    if (this.hasAction('edit') || this.hasAction('update')) {
      visibleActions.push('edit');
    }
    
    if (this.hasAction('toggle-status')) {
      visibleActions.push('toggle-status');
    }
    
    if (this.shouldShowVerifyEmail()) {
      visibleActions.push('verify-email');
    }
    
    if (this.hasAction('delete')) {
      visibleActions.push('delete');
    }
    
    return visibleActions;
  }
}