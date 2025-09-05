import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { FormWrapperComponent } from './form-wrapper.component';

@Component({
  standalone: true,
  imports: [FormWrapperComponent, ReactiveFormsModule],
  template: `
    <app-form-wrapper 
      [formGroup]="testForm"
      [submitButtonText]="submitButtonText"
      [resetButtonText]="resetButtonText"
      [showResetButton]="showResetButton"
      [showSubmitButton]="showSubmitButton"
      [submitButtonClass]="submitButtonClass"
      [resetButtonClass]="resetButtonClass"
      [formClass]="formClass"
      [buttonsContainerClass]="buttonsContainerClass"
      [disabled]="disabled"
      [autoMarkAsTouched]="autoMarkAsTouched"
      [resetToInitialValues]="resetToInitialValues"
      (formSubmit)="onFormSubmit($event)"
      (formReset)="onFormReset()"
      (formStatusChange)="onFormStatusChange($event)">
      
      <input type="text" formControlName="name" class="form-control">
      <input type="email" formControlName="email" class="form-control">
    </app-form-wrapper>
  `
})
class TestHostComponent {
  
  testForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    tags: new FormControl([]),
    active: new FormControl(false)
  });
  
  submitButtonText = 'Enviar';
  resetButtonText = 'Limpar';
  showResetButton = true;
  showSubmitButton = true;
  submitButtonClass = 'btn btn-primary';
  resetButtonClass = 'btn btn-outline-secondary';
  formClass = '';
  buttonsContainerClass = 'col-12 d-flex justify-content-end gap-2 mt-4';
  disabled = false;
  autoMarkAsTouched = true;
  resetToInitialValues = false;
  
  formSubmitData: Record<string, unknown> | null = null;
  formResetCalled = false;
  formStatusChangeData: {valid: boolean; touched: boolean; dirty: boolean} | null = null;
  
  onFormSubmit(data: Record<string, unknown>): void {
    this.formSubmitData = data;
  }
  
  onFormReset(): void {
    this.formResetCalled = true;
  }
  
  onFormStatusChange(status: {valid: boolean; touched: boolean; dirty: boolean}): void {
    this.formStatusChangeData = status;
  }
}

describe('FormWrapperComponent', () => {
  let component: FormWrapperComponent;
  let fixture: ComponentFixture<FormWrapperComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormWrapperComponent);
    component = fixture.componentInstance;
    
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default input values', () => {
      expect(component.submitButtonText).toBe('Enviar');
      expect(component.resetButtonText).toBe('Limpar');
      expect(component.showResetButton).toBe(true);
      expect(component.showSubmitButton).toBe(true);
      expect(component.submitButtonClass).toBe('btn btn-primary');
      expect(component.resetButtonClass).toBe('btn btn-outline-secondary');
      expect(component.formClass).toBe('');
      expect(component.buttonsContainerClass).toBe('col-12 d-flex justify-content-end gap-2 mt-4');
      expect(component.disabled).toBe(false);
      expect(component.autoMarkAsTouched).toBe(true);
      expect(component.resetToInitialValues).toBe(false);
    });

    it('should accept custom input values', () => {
      component.submitButtonText = 'Custom Submit';
      component.resetButtonText = 'Custom Reset';
      component.showResetButton = false;
      component.showSubmitButton = false;
      component.submitButtonClass = 'btn btn-success';
      component.resetButtonClass = 'btn btn-warning';
      component.formClass = 'custom-form';
      component.buttonsContainerClass = 'custom-buttons';
      component.disabled = true;
      component.autoMarkAsTouched = false;
      component.resetToInitialValues = true;
      
      expect(component.submitButtonText).toBe('Custom Submit');
      expect(component.resetButtonText).toBe('Custom Reset');
      expect(component.showResetButton).toBe(false);
      expect(component.showSubmitButton).toBe(false);
      expect(component.submitButtonClass).toBe('btn btn-success');
      expect(component.resetButtonClass).toBe('btn btn-warning');
      expect(component.formClass).toBe('custom-form');
      expect(component.buttonsContainerClass).toBe('custom-buttons');
      expect(component.disabled).toBe(true);
      expect(component.autoMarkAsTouched).toBe(false);
      expect(component.resetToInitialValues).toBe(true);
    });
  });

  describe('ngOnInit', () => {
    it('should store initial form value and subscribe to status changes', () => {
      const testForm = new FormGroup({
        name: new FormControl('John'),
        email: new FormControl('john@test.com')
      });
      
      component.formGroup = testForm;
      component.ngOnInit();
      
      expect(component['initialFormValue']).toEqual({
        name: 'John',
        email: 'john@test.com'
      });
    });

    it('should emit form status changes', () => {
      const testForm = new FormGroup({
        name: new FormControl('', [Validators.required])
      });
      
      spyOn(component.formStatusChange, 'emit');
      component.formGroup = testForm;
      component.ngOnInit();
      
      
      testForm.get('name')?.setValue('test');
      
      expect(component.formStatusChange.emit).toHaveBeenCalledWith({
        valid: testForm.valid,
        touched: testForm.touched,
        dirty: testForm.dirty
      });
    });

    it('should not subscribe if formGroup is not provided', () => {
      spyOn(component.formStatusChange, 'emit');
      component.formGroup = null!;
      component.ngOnInit();
      
      expect(component.formStatusChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy subject', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      const testForm = new FormGroup({
        name: new FormControl('John', [Validators.required]),
        email: new FormControl('john@test.com', [Validators.required, Validators.email])
      });
      component.formGroup = testForm;
    });

    it('should emit form value when form is valid and not disabled', () => {
      spyOn(component.formSubmit, 'emit');
      component.disabled = false;
      
      component.onSubmit();
      
      expect(component.formSubmit.emit).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@test.com'
      });
    });

    it('should not emit when form is invalid', () => {
      spyOn(component.formSubmit, 'emit');
      spyOn(component.formGroup, 'markAllAsTouched');
      
      component.formGroup.get('name')?.setValue('');
      component.autoMarkAsTouched = true;
      
      component.onSubmit();
      
      expect(component.formSubmit.emit).not.toHaveBeenCalled();
      expect(component.formGroup.markAllAsTouched).toHaveBeenCalled();
    });

    it('should not emit when form is disabled', () => {
      spyOn(component.formSubmit, 'emit');
      component.disabled = true;
      
      component.onSubmit();
      
      expect(component.formSubmit.emit).not.toHaveBeenCalled();
    });

    it('should not mark as touched when autoMarkAsTouched is false', () => {
      spyOn(component.formSubmit, 'emit');
      spyOn(component.formGroup, 'markAllAsTouched');
      
      component.formGroup.get('name')?.setValue('');
      component.autoMarkAsTouched = false;
      
      component.onSubmit();
      
      expect(component.formSubmit.emit).not.toHaveBeenCalled();
      expect(component.formGroup.markAllAsTouched).not.toHaveBeenCalled();
    });
  });

  describe('onReset', () => {
    beforeEach(() => {
      const testForm = new FormGroup({
        name: new FormControl('John'),
        email: new FormControl('john@test.com'),
        tags: new FormControl([]),
        active: new FormControl(false)
      });
      component.formGroup = testForm;
      component.ngOnInit(); 
    });

    it('should reset to initial values when resetToInitialValues is true', () => {
      spyOn(component.formGroup, 'reset');
      spyOn(component.formReset, 'emit');
      
      component.resetToInitialValues = true;
      component.onReset();
      
      expect(component.formGroup.reset).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@test.com',
        tags: [],
        active: false
      });
      expect(component.formReset.emit).toHaveBeenCalled();
    });

    it('should reset with special handling for arrays and booleans when resetToInitialValues is false', () => {
      spyOn(component.formGroup, 'reset');
      spyOn(component.formReset, 'emit');
      
      component.resetToInitialValues = false;
      component.onReset();
      
      expect(component.formGroup.reset).toHaveBeenCalledWith({
        tags: [],
        active: false
      });
      expect(component.formReset.emit).toHaveBeenCalled();
    });

    it('should handle empty arrays in reset values', () => {
      const testForm = new FormGroup({
        emptyArray: new FormControl([]),
        nonEmptyArray: new FormControl(['item'])
      });
      component.formGroup = testForm;
      component.ngOnInit();
      
      spyOn(component.formGroup, 'reset');
      component.resetToInitialValues = false;
      component.onReset();
      
      expect(component.formGroup.reset).toHaveBeenCalledWith({
        emptyArray: []
      });
    });

    it('should handle false boolean values in reset', () => {
      const testForm = new FormGroup({
        falseBoolean: new FormControl(false),
        trueBoolean: new FormControl(true)
      });
      component.formGroup = testForm;
      component.ngOnInit();
      
      spyOn(component.formGroup, 'reset');
      component.resetToInitialValues = false;
      component.onReset();
      
      expect(component.formGroup.reset).toHaveBeenCalledWith({
        falseBoolean: false
      });
    });
  });

  describe('isSubmitDisabled getter', () => {
    beforeEach(() => {
      const testForm = new FormGroup({
        name: new FormControl('', [Validators.required])
      });
      component.formGroup = testForm;
    });

    it('should return true when form is invalid', () => {
      component.disabled = false;
      expect(component.isSubmitDisabled).toBe(true);
    });

    it('should return true when component is disabled', () => {
      component.formGroup.get('name')?.setValue('test');
      component.disabled = true;
      expect(component.isSubmitDisabled).toBe(true);
    });

    it('should return false when form is valid and component is not disabled', () => {
      component.formGroup.get('name')?.setValue('test');
      component.disabled = false;
      expect(component.isSubmitDisabled).toBe(false);
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      hostFixture.detectChanges();
    });

    it('should render form with correct class', () => {
      hostComponent.formClass = 'custom-form-class';
      hostFixture.detectChanges();
      
      const formElement = hostFixture.debugElement.query(By.css('form'));
      expect(formElement.nativeElement.classList.contains('custom-form-class')).toBe(true);
    });

    it('should render submit button with correct properties', () => {
      hostComponent.submitButtonText = 'Custom Submit';
      hostComponent.submitButtonClass = 'btn btn-success';
      hostFixture.detectChanges();
      
      const submitButton = hostFixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton.nativeElement.textContent.trim()).toBe('Custom Submit');
      expect(submitButton.nativeElement.className).toContain('btn');
      expect(submitButton.nativeElement.className).toContain('btn-success');
    });

    it('should render reset button with correct properties', () => {
      hostComponent.resetButtonText = 'Custom Reset';
      hostComponent.resetButtonClass = 'btn btn-warning';
      hostFixture.detectChanges();
      
      const resetButton = hostFixture.debugElement.query(By.css('button[type="button"]'));
      expect(resetButton.nativeElement.textContent.trim()).toBe('Custom Reset');
      expect(resetButton.nativeElement.className).toContain('btn');
      expect(resetButton.nativeElement.className).toContain('btn-warning');
    });

    it('should hide submit button when showSubmitButton is false', () => {
      hostComponent.showSubmitButton = false;
      hostFixture.detectChanges();
      
      const submitButton = hostFixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton).toBeFalsy();
    });

    it('should hide reset button when showResetButton is false', () => {
      hostComponent.showResetButton = false;
      hostFixture.detectChanges();
      
      const resetButtons = hostFixture.debugElement.queryAll(By.css('button[type="button"]'));
      const resetButton = resetButtons.find(btn => btn.nativeElement.textContent.trim() === hostComponent.resetButtonText);
      expect(resetButton).toBeFalsy();
    });

    it('should disable submit button when form is invalid or component is disabled', () => {
      
      const submitButton = hostFixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton.nativeElement.disabled).toBe(true);
      
      
      hostComponent.testForm.patchValue({ name: 'test', email: 'test@test.com' });
      hostFixture.detectChanges();
      expect(submitButton.nativeElement.disabled).toBe(false);
      
      
      hostComponent.disabled = true;
      hostFixture.detectChanges();
      expect(submitButton.nativeElement.disabled).toBe(true);
    });

    it('should call onSubmit when form is submitted', () => {
      hostComponent.testForm.patchValue({ name: 'test', email: 'test@test.com' });
      hostFixture.detectChanges();
      
      const formElement = hostFixture.debugElement.query(By.css('form'));
      formElement.triggerEventHandler('ngSubmit', null);
      
      expect(hostComponent.formSubmitData).toEqual({
        name: 'test',
        email: 'test@test.com',
        tags: [],
        active: false
      });
    });

    it('should call onReset when reset button is clicked', () => {
      const resetButton = hostFixture.debugElement.query(By.css('button[type="button"]'));
      resetButton.triggerEventHandler('click', null);
      
      expect(hostComponent.formResetCalled).toBe(true);
    });

    it('should apply buttons container class', () => {
      hostComponent.buttonsContainerClass = 'custom-buttons-class';
      hostFixture.detectChanges();
      
      const buttonsContainer = hostFixture.debugElement.query(By.css('.custom-buttons-class'));
      expect(buttonsContainer).toBeTruthy();
    });
  });
});