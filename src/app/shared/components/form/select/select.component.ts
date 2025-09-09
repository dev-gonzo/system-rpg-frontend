import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, WrapperComponent, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent extends ColumnHostClass {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Selecione';
  @Input() id?: string;
  @Input() helper: string = '';
  @Input() fieldName?: string;
  
  @Output() blurEvent = new EventEmitter<string>();

  get selectId(): string {
    return this.id ?? `select-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) return null;

    return typeof this.control.errors['message'] === 'string' ? this.control.errors['message'] : null;
  }

  onBlur(): void {
    if (this.control) {
      this.control.markAsTouched();
      this.control.updateValueAndValidity();
      
      if (this.fieldName) {
        this.blurEvent.emit(this.fieldName);
      }
    }
  }
}
