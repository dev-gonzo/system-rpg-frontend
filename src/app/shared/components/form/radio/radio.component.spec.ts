import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { RadioComponent, RadioOption } from './radio.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('RadioComponent', () => {
  let component: RadioComponent;
  let fixture: ComponentFixture<RadioComponent>;
  let mockOptions: RadioOption[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioComponent, WrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioComponent);
    component = fixture.componentInstance;
    
    mockOptions = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 3 }
    ];

    component.control = new FormControl('');
    component.options = mockOptions;
    component.name = 'test-radio';
    component.label = 'Test Radio Group';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have required control input', () => {
      expect(component.control).toBeDefined();
      expect(component.control).toBeInstanceOf(FormControl);
    });

    it('should have default label as empty string', () => {
      const newComponent = TestBed.createComponent(RadioComponent).componentInstance;
      expect(newComponent.label).toBe('');
    });

    it('should have default name as empty string', () => {
      const newComponent = TestBed.createComponent(RadioComponent).componentInstance;
      expect(newComponent.name).toBe('');
    });

    it('should have default options as empty array', () => {
      const newComponent = TestBed.createComponent(RadioComponent).componentInstance;
      expect(newComponent.options).toEqual([]);
    });

    it('should have default inline as false', () => {
      const newComponent = TestBed.createComponent(RadioComponent).componentInstance;
      expect(newComponent.inline).toBe(false);
    });

    it('should accept custom label', () => {
      component.label = 'Custom Label';
      expect(component.label).toBe('Custom Label');
    });

    it('should accept custom name', () => {
      component.name = 'custom-name';
      expect(component.name).toBe('custom-name');
    });

    it('should accept custom options', () => {
      const customOptions = [{ label: 'Custom', value: 'custom' }];
      component.options = customOptions;
      expect(component.options).toEqual(customOptions);
    });

    it('should accept inline property', () => {
      component.inline = true;
      expect(component.inline).toBe(true);
    });
  });

  describe('Error Getter', () => {
    it('should return null when control is not touched', () => {
      component.control = new FormControl('', Validators.required);
      expect(component.error).toBeNull();
    });

    it('should return null when control has no errors', () => {
      component.control = new FormControl('valid-value');
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return null when control is null', () => {
      component.control = null as unknown as FormControl;
      expect(component.error).toBeNull();
    });

    it('should return error message when control has message error', () => {
      component.control = new FormControl('', Validators.required);
      component.control.markAsTouched();
      component.control.setErrors({ message: 'This field is required' });
      expect(component.error).toBe('This field is required');
    });

    it('should return null when error is not a string message', () => {
      component.control = new FormControl('', Validators.required);
      component.control.setErrors({ required: true });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });
  });

  describe('ColumnHostClass Inheritance', () => {
    it('should have col property with default null', () => {
      expect(component.col).toBeNull();
    });

    it('should have colMd property with default null', () => {
      expect(component.colMd).toBeNull();
    });

    it('should have colLg property with default null', () => {
      expect(component.colLg).toBeNull();
    });

    it('should have colXl property with default null', () => {
      expect(component.colXl).toBeNull();
    });

    it('should return empty string for hostClass when no col properties set', () => {
      expect(component.hostClass).toBe('');
    });

    it('should return correct hostClass for col property', () => {
      component.col = 6;
      expect(component.hostClass).toBe('col-6');
    });

    it('should return correct hostClass for colMd property', () => {
      component.colMd = 8;
      expect(component.hostClass).toBe('col-md-8');
    });

    it('should return correct hostClass for colLg property', () => {
      component.colLg = 4;
      expect(component.hostClass).toBe('col-lg-4');
    });

    it('should return correct hostClass for colXl property', () => {
      component.colXl = 12;
      expect(component.hostClass).toBe('col-xl-12');
    });

    it('should return combined hostClass for multiple col properties', () => {
      component.col = 12;
      component.colMd = 6;
      component.colLg = 4;
      component.colXl = 3;
      expect(component.hostClass).toBe('col-12 col-md-6 col-lg-4 col-xl-3');
    });

    it('should handle string values for col properties', () => {
      component.col = 'auto';
      component.colMd = 'auto';
      expect(component.hostClass).toBe('col-auto col-md-auto');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      
      component.control = new FormControl('');
      component.options = mockOptions;
      component.name = 'test-radio';
      component.label = 'Test Radio Group';
      fixture.detectChanges();
    });

    it('should render wrapper component', () => {
      const wrapperElement = fixture.debugElement.query(By.css('app-form-wrapper'));
      expect(wrapperElement).toBeTruthy();
    });

    it('should render wrapper component', () => {
      const wrapperElement = fixture.debugElement.query(By.css('app-form-wrapper'));
      expect(wrapperElement).toBeTruthy();
    });



    it('should render label with correct classes', () => {
      const labelElement = fixture.debugElement.query(By.css('label.fw-medium'));
      expect(labelElement).toBeTruthy();
      expect(labelElement.nativeElement.classList).toContain('fw-medium');
    });

    it('should render radio buttons for each option', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs.length).toBe(3);
    });

    it('should render labels for each option', () => {
      const labels = fixture.debugElement.queryAll(By.css('label.form-check-label'));
      expect(labels.length).toBe(3);
      expect(labels[0]).toBeTruthy();
      expect(labels[1]).toBeTruthy();
      expect(labels[2]).toBeTruthy();
      expect(labels[0].nativeElement.textContent.trim()).toBe('Option 1');
      expect(labels[1].nativeElement.textContent.trim()).toBe('Option 2');
      expect(labels[2].nativeElement.textContent.trim()).toBe('Option 3');
    });

    it('should not render radio buttons when options is empty', () => {
      component.options = [];
      fixture.detectChanges();
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs.length).toBe(0);
    });

    it('should render empty label when label is empty', () => {
      component.label = '';
      fixture.detectChanges();
      const labelElement = fixture.debugElement.query(By.css('label.fw-medium'));
      expect(labelElement.nativeElement.textContent.trim()).toBe('');
    });
  });

  describe('Inline vs Vertical Layout', () => {
    it('should apply vertical layout classes by default', () => {
      fixture.detectChanges();
      const containerDiv = fixture.debugElement.query(By.css('div.d-flex'));
      expect(containerDiv.nativeElement.classList).toContain('d-flex');
      expect(containerDiv.nativeElement.classList).toContain('flex-column');
      expect(containerDiv.nativeElement.classList).toContain('gap-2');
    });

    it('should apply inline layout classes when inline is true', () => {
      component.inline = true;
      fixture.detectChanges();
      const containerDiv = fixture.debugElement.query(By.css('div.d-flex'));
      expect(containerDiv.nativeElement.classList).toContain('d-flex');
      expect(containerDiv.nativeElement.classList).toContain('flex-row');
      expect(containerDiv.nativeElement.classList).toContain('gap-3');
    });

    it('should apply form-check class for vertical layout', () => {
      fixture.detectChanges();
      const checkDivs = fixture.debugElement.queryAll(By.css('.form-check'));
      expect(checkDivs.length).toBe(3);
      checkDivs.forEach(div => {
        expect(div.nativeElement.classList).toContain('form-check');
        expect(div.nativeElement.classList).not.toContain('form-check-inline');
      });
    });

    it('should apply form-check-inline class for inline layout', () => {
      component.inline = true;
      fixture.detectChanges();
      const checkDivs = fixture.debugElement.queryAll(By.css('.form-check'));
      expect(checkDivs.length).toBe(3);
      checkDivs.forEach(div => {
        expect(div.nativeElement.classList).toContain('form-check');
        expect(div.nativeElement.classList).toContain('form-check-inline');
      });
    });
  });

  describe('FormControl Integration', () => {
    beforeEach(() => {
      component.options = mockOptions;
      component.name = 'test-radio';
      fixture.detectChanges();
    });

    it('should bind FormControl to radio inputs', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      radioInputs.forEach(input => {
        expect(input.nativeElement.getAttribute('ng-reflect-form-control')).toBeDefined();
      });
    });



    it('should select radio button when FormControl value changes', () => {
      component.control.setValue('opt2');
      fixture.detectChanges();
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs.length).toBe(3);
      expect(radioInputs[1]).toBeTruthy();
      expect(radioInputs[0]).toBeTruthy();
      expect(radioInputs[2]).toBeTruthy();
      expect(radioInputs[1].nativeElement.checked).toBe(true);
      expect(radioInputs[0].nativeElement.checked).toBe(false);
      expect(radioInputs[2].nativeElement.checked).toBe(false);
    });

    it('should update FormControl value when radio button is clicked', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs.length).toBe(3);
      expect(radioInputs[2]).toBeTruthy();
      radioInputs[2].nativeElement.click();
      fixture.detectChanges();
      expect(component.control.value).toBe(3);
    });

    it('should handle numeric values correctly', () => {
      component.control.setValue(3);
      fixture.detectChanges();
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs.length).toBe(3);
      expect(radioInputs[2]).toBeTruthy();
      expect(radioInputs[2].nativeElement.checked).toBe(true);
    });
  });

  describe('Accessibility Attributes', () => {
    beforeEach(() => {
      component.options = mockOptions;
      component.name = 'test-radio';
      fixture.detectChanges();
    });



    it('should set unique id for each radio input', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs[0].nativeElement.id).toBe('test-radio_opt1');
      expect(radioInputs[1].nativeElement.id).toBe('test-radio_opt2');
      expect(radioInputs[2].nativeElement.id).toBe('test-radio_3');
    });

    it('should set correct for attribute on labels', () => {
      const labels = fixture.debugElement.queryAll(By.css('label.form-check-label'));
      expect(labels[0].nativeElement.getAttribute('for')).toBe('test-radio_opt1');
      expect(labels[1].nativeElement.getAttribute('for')).toBe('test-radio_opt2');
      expect(labels[2].nativeElement.getAttribute('for')).toBe('test-radio_3');
    });

    it('should have wrapper and label for proper grouping', () => {
      fixture.detectChanges();
      const wrapper = fixture.debugElement.query(By.css('app-form-wrapper'));
      const label = fixture.debugElement.query(By.css('label.fw-medium'));
      expect(wrapper).toBeTruthy();
      expect(label).toBeTruthy();
    });

    it('should apply correct CSS classes to labels', () => {
      const labels = fixture.debugElement.queryAll(By.css('label.form-check-label'));
      labels.forEach(label => {
        expect(label.nativeElement.classList).toContain('form-check-label');
        expect(label.nativeElement.classList).toContain('small');
      });
    });

    it('should apply correct CSS classes to radio inputs', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      radioInputs.forEach(input => {
        expect(input.nativeElement.classList).toContain('form-check-input');
      });
    });
  });

  describe('Error State Styling', () => {
    it('should apply text-danger class to main label when there is an error', () => {
      fixture.detectChanges();
      component.control.setErrors({ message: 'Error message' });
      component.control.markAsTouched();
      fixture.detectChanges();
      const labelElement = fixture.debugElement.query(By.css('label.fw-medium'));
      expect(labelElement.nativeElement.classList).toContain('text-danger');
    });

    it('should not apply text-danger class to main label when there is no error', () => {
      fixture.detectChanges();
      const labelElement = fixture.debugElement.query(By.css('label.fw-medium'));
      expect(labelElement.nativeElement.classList).not.toContain('text-danger');
    });

    it('should apply text-danger class to labels when there is an error', () => {
      fixture.detectChanges();
      component.control.setErrors({ message: 'Error message' });
      component.control.markAsTouched();
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('label.form-check-label'));
      labels.forEach(label => {
        expect(label.nativeElement.classList).toContain('text-danger');
      });
    });

    it('should not apply text-danger class to labels when there is no error', () => {
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('label.form-check-label'));
      labels.forEach(label => {
        expect(label.nativeElement.classList).not.toContain('text-danger');
      });
    });
  });

  describe('Wrapper Component Integration', () => {
    it('should pass empty label to wrapper component', () => {
      fixture.detectChanges();
      const wrapperElement = fixture.debugElement.query(By.css('app-form-wrapper'));
      expect(wrapperElement.componentInstance.label).toBe('');
    });

    it('should pass error to wrapper component', () => {
      fixture.detectChanges();
      component.control.setErrors({ message: 'Test error' });
      component.control.markAsTouched();
      fixture.detectChanges();
      const wrapperElement = fixture.debugElement.query(By.css('app-form-wrapper'));
      expect(wrapperElement.componentInstance.error).toBe('Test error');
    });

    it('should pass inputId to wrapper component', () => {
      fixture.detectChanges();
      const wrapperElement = fixture.debugElement.query(By.css('app-form-wrapper'));
      expect(wrapperElement.componentInstance.inputId).toBe('test-radio');
    });
  });
});