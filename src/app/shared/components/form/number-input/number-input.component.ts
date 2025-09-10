import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

export type NumberInputType = 'integer' | 'decimal' | 'currency';

@Component({
  selector: 'app-form-number-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    WrapperComponent
  ],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
})
export class NumberInputComponent extends ColumnHostClass {
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  
  @Input({ required: true }) control!: FormControl<number | null>;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() id?: string;
  @Input() helper: string = '';
  @Input() fieldName?: string;
  @Input() numberType: NumberInputType = 'decimal';
  @Input() min?: number;
  @Input() max?: number;
  @Input() step: number = 1;
  @Input() decimalPlaces: number = 2;
  @Input() currencySymbol: string = 'R$';
  @Input() disabled: boolean = false;
  
  @Output() blurEvent = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<number | null>();

  get inputId(): string {
    return this.id ?? `number-input-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) return null;
    return typeof this.control.errors['message'] === 'string' ? this.control.errors['message'] : null;
  }

  get displayValue(): string {
    const value = this.control.value;
    if (value === null || value === undefined) return '';
    
    switch (this.numberType) {
      case 'integer':
        return Math.floor(value).toString();
      case 'decimal':
        return value.toFixed(this.decimalPlaces);
      case 'currency':
        return this.formatCurrency(value);
      default:
        return value.toString();
    }
  }

  get stepValue(): number {
    switch (this.numberType) {
      case 'integer':
        return 1;
      case 'decimal':
        return parseFloat((1 / Math.pow(10, this.decimalPlaces)).toFixed(this.decimalPlaces));
      case 'currency':
        return 0.01;
      default:
        return this.step;
    }
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: this.decimalPlaces,
      maximumFractionDigits: this.decimalPlaces
    }).format(value);
  }

  private parseValue(value: string): number | null {
    if (!value || value.trim() === '') return null;
    
    
    const cleanValue = value.replace(/[^\d,-]/g, '').replace(',', '.');
    
    const parsed = parseFloat(cleanValue);
    if (isNaN(parsed)) return null;
    
    switch (this.numberType) {
      case 'integer':
        return Math.floor(parsed);
      case 'decimal':
        return parseFloat(parsed.toFixed(this.decimalPlaces));
      case 'currency':
        return parseFloat(parsed.toFixed(2));
      default:
        return parsed;
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const parsedValue = this.parseValue(target.value);
    
    if (this.isValidValue(parsedValue)) {
      this.control.setValue(parsedValue);
      this.valueChange.emit(parsedValue);
    }
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

  increment(): void {
    if (this.disabled) return;
    
    let currentValue = this.control.value;
    
    
    if (currentValue === null && this.min !== undefined) {
      currentValue = this.min;
    } else {
      currentValue = currentValue ?? 0;
    }
    
    const newValue = currentValue + this.stepValue;
    
    if (this.isValidValue(newValue)) {
      this.control.setValue(newValue);
      this.valueChange.emit(newValue);
      
      
      if (this.fieldName) {
        this.blurEvent.emit(this.fieldName);
      }
    }
  }

  decrement(): void {
    if (this.disabled) return;
    
    let currentValue = this.control.value;
    
    
    if (currentValue === null && this.min !== undefined) {
      currentValue = this.min;
    } else {
      currentValue = currentValue ?? 0;
    }
    
    const newValue = currentValue - this.stepValue;
    
    if (this.isValidValue(newValue)) {
      this.control.setValue(newValue);
      this.valueChange.emit(newValue);
      
      
      if (this.fieldName) {
        this.blurEvent.emit(this.fieldName);
      }
    }
  }

  private isValidValue(value: number | null): boolean {
    if (value === null) return true;
    
    if (this.min !== undefined && value < this.min) return false;
    if (this.max !== undefined && value > this.max) return false;
    
    return true;
  }

  focus(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }
}