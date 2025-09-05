import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    WrapperComponent
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent extends ColumnHostClass {
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  
  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() id?: string;
  @Input() mask?: string;
  @Input() autocomplete?: string = 'off';
  @Input() helper: string = '';
  @Input() fieldName?: string; 
  
  @Output() blurEvent = new EventEmitter<string>();

  get inputId(): string {
    return this.id ?? `input-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
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

  focus(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }
}
