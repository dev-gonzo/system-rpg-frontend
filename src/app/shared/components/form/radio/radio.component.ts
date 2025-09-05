import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

export interface RadioOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-form-radio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, WrapperComponent],
  templateUrl: './radio.component.html',
})
export class RadioComponent extends ColumnHostClass {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() name = '';
  @Input() options: RadioOption[] = [];
  @Input() inline = false;
  @Input() helper: string = '';

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) return null;

    return typeof this.control.errors['message'] === 'string' ? this.control.errors['message'] : null;
  }
}
