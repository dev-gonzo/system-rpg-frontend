import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';

export interface AutocompleteOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-form-wrapper',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wrapper.component.html',

})
export class WrapperComponent extends ColumnHostClass {
  @Input() label = '';
  @Input() error: string | null = '';
  @Input() helper = '';
  @Input() inputId = '';
}
