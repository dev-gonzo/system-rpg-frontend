import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'app-form-input-view',
  standalone: true,
  imports: [
    CommonModule,
    WrapperComponent
  ],
  templateUrl: './input-view.component.html',
  styleUrl: './input-view.component.scss',
})
export class InputViewComponent extends ColumnHostClass {
  @Input({ required: true }) value: string | number | null = null;
  @Input() label = '';
  @Input() id?: string;
  @Input() helper: string = '';
  @Input() fieldName?: string;
  @Input() placeholder: string = '-';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() copyable: boolean = false;

  private _generatedId?: string;
  
  get inputId(): string {
    if (this.id) {
      return this.id;
    }
    if (!this._generatedId) {
      this._generatedId = `input-view-${Math.random().toString(36).substr(2, 9)}`;
    }
    return this._generatedId;
  }

  
  get displayValue(): string {
    if (this.value === null || this.value === undefined || this.value === '') {
      return this.placeholder;
    }
    return `${this.prefix}${this.value}${this.suffix}`;
  }

  
  async copyToClipboard(): Promise<void> {
    if (!this.copyable || !this.value) return;
    
    try {
      await navigator.clipboard.writeText(this.displayValue);
    } catch {
      
      return;
    }
  }
}