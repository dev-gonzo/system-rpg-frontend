import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-form-wrapper',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-wrapper.component.html',
  styleUrls: ['./form-wrapper.component.scss']
})
export class FormWrapperComponent implements OnInit, OnDestroy {
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  @Input() formGroup!: FormGroup;
  @Input() submitButtonText = 'Enviar';
  @Input() resetButtonText = 'Limpar';
  @Input() showResetButton = true;
  @Input() showSubmitButton = true;
  @Input() submitButtonClass = 'btn btn-primary';
  @Input() resetButtonClass = 'btn btn-outline-secondary';
  @Input() formClass = '';
  @Input() buttonsContainerClass = 'col-12 d-flex justify-content-end gap-2 mt-4';
  @Input() disabled = false;
  @Input() autoMarkAsTouched = true;
  @Input() resetToInitialValues = false;


  @Output() formSubmit = new EventEmitter<Record<string, unknown>>();
  @Output() formReset = new EventEmitter<void>();
  @Output() formStatusChange = new EventEmitter<{valid: boolean; touched: boolean; dirty: boolean}>();

  @ContentChild('customButtons') customButtonsTemplate?: TemplateRef<unknown>;

  private initialFormValue: Record<string, unknown> = {};

  ngOnInit(): void {
    if (this.formGroup) {
      
      this.initialFormValue = this.formGroup.value;
      
      
      this.formGroup.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.formStatusChange.emit({
            valid: this.formGroup.valid,
            touched: this.formGroup.touched,
            dirty: this.formGroup.dirty
          });
          this.cdRef.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.disabled) {
      return;
    }
    
    
    this.formSubmit.emit(this.formGroup.value);
  }

  onReset(): void {
    if (this.resetToInitialValues && this.initialFormValue) {
      this.formGroup.reset(this.initialFormValue);
    } else {
      
      const resetValues: Record<string, unknown> = {};
      
      
      Object.keys(this.formGroup.controls).forEach(key => {
        const value = this.initialFormValue[key];
        
        
        if (Array.isArray(value) && value.length === 0) {
          resetValues[key] = [];
        }
        
        else if (value === false) {
          resetValues[key] = false;
        }
        
      });
      
      this.formGroup.reset(resetValues);
    }
    this.formReset.emit();
  }




}