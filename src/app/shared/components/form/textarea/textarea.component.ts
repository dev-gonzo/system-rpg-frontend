import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WrapperComponent
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent extends ColumnHostClass {
  @ViewChild('textareaElement') textareaElement!: ElementRef<HTMLTextAreaElement>;
  
  @Input({ required: true }) control!: FormControl<string | null>;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() id?: string;
  @Input() autocomplete?: string = 'off';
  @Input() helper: string = '';
  @Input() fieldName?: string;
  @Input() rows: number = 3;
  @Input() cols?: number;
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() resize: 'none' | 'both' | 'horizontal' | 'vertical' = 'vertical';
  
  @Output() blurEvent = new EventEmitter<string>();

  get inputId(): string {
    return this.id ?? `textarea-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
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
    if (this.textareaElement) {
      this.textareaElement.nativeElement.focus();
    }
  }
}