import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

export interface PasswordStrength {
  score: number;
  label: 'fraca' | 'média' | 'forte';
  class: 'danger' | 'warning' | 'success';
}

export interface PasswordCriteria {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

@Component({
  selector: 'app-form-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WrapperComponent,
    MatIconModule
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent extends ColumnHostClass {
  @Input({ required: true }) passwordControl!: FormControl<string | null>;
  @Input({ required: true }) confirmPasswordControl!: FormControl<string | null>;
  @Input() passwordLabel = 'Senha';
  @Input() confirmPasswordLabel = 'Confirmar Senha';
  @Input() passwordPlaceholder = 'Digite sua senha';
  @Input() confirmPasswordPlaceholder = 'Confirme sua senha';
  @Input() passwordId?: string;
  @Input() confirmPasswordId?: string;

  showCriteria = false;
  isPasswordFocused = false;
  passwordFieldType: 'password' | 'text' = 'password';
  confirmPasswordFieldType: 'password' | 'text' = 'password';
  criteriaPosition = { up: false, right: false };


  get passwordInputId(): string {
    return this.passwordId ?? `password-${this.passwordLabel.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get confirmPasswordInputId(): string {
    return this.confirmPasswordId ?? `confirm-password-${this.confirmPasswordLabel.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get passwordError(): string | null {
    if (!this.passwordControl?.touched || !this.passwordControl.errors) return null;

    const errors = this.passwordControl.errors;
    return typeof errors['message'] === 'string' ? errors['message'] : null;
  }

  get confirmPasswordError(): string | null {
    if (!this.confirmPasswordControl?.touched || !this.confirmPasswordControl.errors) return null;

    const errors = this.confirmPasswordControl.errors;
    return typeof errors['message'] === 'string' ? errors['message'] : null;
  }

  get passwordValue(): string {
    return this.passwordControl?.value ?? '';
  }

  get passwordCriteria(): PasswordCriteria {
    const password = this.passwordValue;
    
    return {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };
  }

  get passwordStrength(): PasswordStrength {
    const criteria = this.passwordCriteria;
    const score = Object.values(criteria).filter(Boolean).length;

    if (score <= 2) {
      return { score, label: 'fraca', class: 'danger' };
    } else if (score <= 4) {
      return { score, label: 'média', class: 'warning' };
    } else {
      return { score, label: 'forte', class: 'success' };
    }
  }

  get passwordStrengthWithPrefix(): string {
    const strength = this.passwordStrength;
    return `Senha ${strength.label}`;
  }

  get isPasswordValid(): boolean {
    return Object.values(this.passwordCriteria).every(Boolean);
  }

  calculateCriteriaPosition(): void {
    const passwordContainer = document.querySelector(`#${this.passwordInputId}`)?.closest('.input-group') as HTMLElement;
    const criteriaElement = passwordContainer?.querySelector('.password-criteria') as HTMLElement;
    
    if (!passwordContainer || !criteriaElement) {
      return;
    }

    const containerRect = passwordContainer.getBoundingClientRect();
    const criteriaRect = criteriaElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    
    const spaceBelow = viewportHeight - containerRect.bottom;
    const criteriaHeight = criteriaRect.height || 300; 
    this.criteriaPosition.up = spaceBelow < criteriaHeight && containerRect.top > criteriaHeight;

    
    const spaceRight = viewportWidth - containerRect.left;
    const criteriaWidth = criteriaRect.width || 320; 
    this.criteriaPosition.right = spaceRight < criteriaWidth && containerRect.right > criteriaWidth;
  }



  onPasswordFocus(): void {
    this.isPasswordFocused = true;
    this.showCriteria = true;
    setTimeout(() => {
      this.calculateCriteriaPosition();
    }, 10);
  }

  onPasswordBlur(): void {
    this.isPasswordFocused = false;
    this.showCriteria = false;
  }

  onPasswordInput(): void {
    if (this.isPasswordValid) {
      this.showCriteria = false;
    } else if (this.isPasswordFocused) {
      this.showCriteria = true;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }
}