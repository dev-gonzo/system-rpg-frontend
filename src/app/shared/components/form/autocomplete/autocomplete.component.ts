import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

export interface AutocompleteOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-form-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, WrapperComponent],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
})
export class AutocompleteComponent extends ColumnHostClass implements OnInit {
  @Input({ required: true }) control!: FormControl;
  @Input() label = '';
  @Input() options: AutocompleteOption[] = [];
  @Input() placeholder = 'Digite para buscar...';
  @Input() id?: string;
  @Input() helper: string = '';

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  filteredOptions: AutocompleteOption[] = [];
  showDropdown = false;

  get inputId(): string {
    return (
      this.id ?? `autocomplete-${this.label.toLowerCase().replace(/\s+/g, '-')}`
    );
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) return null;

    return typeof this.control.errors['message'] === 'string' ? this.control.errors['message'] : null;
  }

  ngOnInit(): void {
    this.filteredOptions = this.options;

    
    setTimeout(() => {
      const selected = this.options.find(o => o.value === this.control.value);
      if (selected) {
        this.inputRef.nativeElement.value = selected.label;
      }
    });
  }

  onInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (input === null || input === undefined) {
      this.filteredOptions = [];
      this.showDropdown = true;
      return;
    }

    this.filteredOptions = this.options.filter(o =>
      o.label.toLowerCase().includes(input.toLowerCase())
    );

    this.showDropdown = true;
  }

  selectOption(option: AutocompleteOption): void {
    this.control.setValue(option.value);
    this.control.markAsTouched();
    this.inputRef.nativeElement.value = option.label;
    this.showDropdown = false;
  }

  onFocus(): void {
    this.filteredOptions = this.options;
    this.showDropdown = true;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
      this.control.markAsTouched();
    }, 150);
  }

  onKeyDown(event: KeyboardEvent, option: AutocompleteOption): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectOption(option);
    }
  }

  get displayLabel(): string {
    const val = this.control?.value;
    const selected = this.options.find(o => o.value === val);
    return selected?.label ?? val ?? '';
  }
}
