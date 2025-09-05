import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'app-form-input-button',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatIconModule,
    WrapperComponent
  ],
  templateUrl: './input-button.component.html',
  styleUrl: './input-button.component.scss',
})
export class InputButtonComponent extends ColumnHostClass {
  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() id?: string;
  @Input() mask?: string;
  @Input() autocomplete?: string = 'off';
  @Input() helper: string = '';
  @Input() fieldName?: string;
  @Input() buttonText = '';
  @Input() buttonIcon = '';
  @Input() buttonDisabled = false;
  @Input() buttonLoading = false;
  @Input() buttonAriaLabel = '';
  
  @Output() blurEvent = new EventEmitter<string>();
  @Output() buttonClick = new EventEmitter<string | null>();

  get inputId(): string {
    return this.id ?? `input-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get error(): string | null {
    if (!this.control?.touched || !this.control.errors) return null;

    return typeof this.control.errors['message'] === 'string' ? this.control.errors['message'] : null;
  }

  onBlur(): void {
    if (this.control?.value) {
      this.blurEvent.emit(this.control.value);
    }
  }

  onButtonClick(): void {
    this.buttonClick.emit(this.control?.value);
  }
}