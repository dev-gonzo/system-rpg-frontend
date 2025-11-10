import { Component, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputComponent } from '../form/input/input.component';
import { AutocompleteComponent, AutocompleteOption } from '../form/autocomplete/autocomplete.component';

import { ConfirmationModalService } from './confirmation-modal.service';
import { Observable, isObservable } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, InputComponent, AutocompleteComponent],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent implements OnInit {
  confirmationModalService = inject(ConfirmationModalService);
  inputControl = new FormControl<string | null>('');
  autocompleteControl = new FormControl<string | number | null>(null);
  autocompleteOptions: AutocompleteOption[] = [];

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    event.preventDefault();
    this.cancel();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
    }
  }

  confirm(): void {
    const current = this.confirmationModalService.getModal();
    let value: string | undefined;
    if (current?.inputMode === 'autocomplete') {
      const selected = this.autocompleteControl.value;
      value = selected != null ? String(selected) : undefined;
    } else {
      value = this.inputControl.value ?? undefined;
    }
    this.confirmationModalService.confirm(value);
  }

  cancel(): void {
    this.confirmationModalService.cancel();
  }

  getConfirmButtonClasses(buttonClass?: string): string {
    const baseClasses = 'btn';
    return `${baseClasses} ${buttonClass ?? 'btn-success'}`;
  }

  getCancelButtonClasses(buttonClass?: string): string {
    const baseClasses = 'btn';
    return `${baseClasses} ${buttonClass ?? 'btn-secondary'}`;
  }

  ngOnInit(): void {
    const current = this.confirmationModalService.getModal();
    if (current?.inputInitialValue) {
      this.inputControl.setValue(current.inputInitialValue);
    }
    if (current?.inputMode === 'autocomplete') {
      this.handleSearch('');
    }
  }

  handleSearch(query: string): void {
    const current = this.confirmationModalService.getModal();
    const onSearch = current?.onSearch;
    if (!onSearch) return;
    try {
      const result = onSearch(query);
      if (isObservable(result)) {
        (result as Observable<AutocompleteOption[]>).subscribe((opts) => {
          this.autocompleteOptions = opts ?? [];
        });
        return;
      }
      if (result instanceof Promise) {
        (result as Promise<AutocompleteOption[]>).then((opts) => {
          this.autocompleteOptions = opts ?? [];
        });
        return;
      }
      this.autocompleteOptions = Array.isArray(result) ? (result as AutocompleteOption[]) : [];
    } catch {
      this.autocompleteOptions = [];
    }
  }
}