import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { InputComponent } from './input.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, WrapperComponent, NgxMaskDirective],
      providers: [provideNgxMask()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    component.label = 'Test Input';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = TestBed.createComponent(InputComponent).componentInstance;
      newComponent.control = new FormControl('');
      
      expect(newComponent.label).toBe('');
      expect(newComponent.placeholder).toBe('');
      expect(newComponent.type).toBe('text');
      expect(newComponent.id).toBeUndefined();
      expect(newComponent.mask).toBeUndefined();
    });

    it('should accept custom input values', () => {
      component.label = 'Custom Label';
      component.placeholder = 'Custom Placeholder';
      component.type = 'email';
      component.id = 'custom-id';
      component.mask = '000.000.000-00';

      expect(component.label).toBe('Custom Label');
      expect(component.placeholder).toBe('Custom Placeholder');
      expect(component.type).toBe('email');
      expect(component.id).toBe('custom-id');
      expect(component.mask).toBe('000.000.000-00');
    });

    it('should accept all valid input types', () => {
      const validTypes: Array<'text' | 'email' | 'password' | 'number' | 'tel'> = 
        ['text', 'email', 'password', 'number', 'tel'];
      
      validTypes.forEach(type => {
        component.type = type;
        expect(component.type).toBe(type);
      });
    });
  });

  describe('inputId getter', () => {
    it('should return custom id when provided', () => {
      component.id = 'custom-input-id';
      expect(component.inputId).toBe('custom-input-id');
    });

    it('should generate id from label when no custom id provided', () => {
      component.id = undefined;
      component.label = 'Test Label';
      expect(component.inputId).toBe('input-test-label');
    });

    it('should handle labels with multiple spaces', () => {
      component.id = undefined;
      component.label = 'Test   Multiple   Spaces';
      expect(component.inputId).toBe('input-test-multiple-spaces');
    });

    it('should handle empty label', () => {
      component.id = undefined;
      component.label = '';
      expect(component.inputId).toBe('input-');
    });

    it('should handle special characters in label', () => {
      component.id = undefined;
      component.label = 'Test@Label#With$Special%Characters';
      expect(component.inputId).toBe('input-test@label#with$special%characters');
    });
  });

  describe('error getter', () => {
    it('should return null when control is not touched', () => {
      component.control = new FormControl('', Validators.required);
      expect(component.error).toBeNull();
    });

    it('should return null when control has no errors', () => {
      component.control = new FormControl('valid-value');
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return error message when control has errors and is touched', () => {
      component.control = new FormControl('', Validators.required);
      component.control.setErrors({ message: 'Campo obrigatório' });
      component.control.markAsTouched();
      expect(component.error).toBe('Campo obrigatório');
    });

    it('should return null when error message is not a string', () => {
      component.control = new FormControl('', Validators.required);
      component.control.setErrors({ message: 123 });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return null when control is null', () => {
      component.control = null as unknown as FormControl;
      expect(component.error).toBeNull();
    });

    it('should return null when control is undefined', () => {
      component.control = undefined as unknown as FormControl;
      expect(component.error).toBeNull();
    });

    it('should return null when control has errors but is not touched', () => {
      component.control = new FormControl('', Validators.required);
      component.control.setErrors({ message: 'Campo obrigatório' });
      
      expect(component.error).toBeNull();
    });

    it('should return null when control is touched but has no errors', () => {
      component.control = new FormControl('valid-value');
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });
  });

  describe('ColumnHostClass inheritance', () => {
    it('should inherit col property', () => {
      component.col = 6;
      expect(component.col).toBe(6);
    });

    it('should inherit colMd property', () => {
      component.colMd = 4;
      expect(component.colMd).toBe(4);
    });

    it('should inherit colLg property', () => {
      component.colLg = 3;
      expect(component.colLg).toBe(3);
    });

    it('should inherit colXl property', () => {
      component.colXl = 2;
      expect(component.colXl).toBe(2);
    });

    it('should inherit hostClass property', () => {
      
      component.col = 6;
      component.colMd = 4;
      expect(component.hostClass).toContain('col-6');
      expect(component.hostClass).toContain('col-md-4');
    });
  });

  describe('Template Rendering', () => {
    it('should render wrapper component with correct inputs', () => {
      const wrapperElement = fixture.debugElement.query(By.directive(WrapperComponent));
      const wrapperComponent = wrapperElement.componentInstance;

      expect(wrapperComponent.label).toBe('Test Input');
      expect(wrapperComponent.inputId).toBe(component.inputId);
    });

    it('should render input element with correct attributes', () => {
      component.placeholder = 'Enter text';
      component.type = 'email';
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.id).toBe(component.inputId);
      expect(inputElement.nativeElement.type).toBe('email');
      expect(inputElement.nativeElement.placeholder).toBe('Enter text');
      expect(inputElement.nativeElement.classList.contains('form-control')).toBe(true);
    });

    it('should apply is-invalid class when there is an error', () => {
      component.control.setErrors({ message: 'Error' });
      component.control.markAsTouched();
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.nativeElement.classList.contains('is-invalid')).toBe(true);
    });

    it('should not apply is-invalid class when there is no error', () => {
      component.control.setErrors(null);
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.nativeElement.classList.contains('is-invalid')).toBe(false);
    });

    it('should render input with mask directive when mask is provided', () => {
      component.mask = '000.000.000-00';
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.componentInstance.mask).toBe('000.000.000-00');
    });

    it('should render input without mask directive when mask is not provided', () => {
      component.mask = undefined;
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.nativeElement.getAttribute('mask')).toBeNull();
    });
  });

  describe('FormControl Integration', () => {
    it('should bind to FormControl value', async () => {
      const testValue = 'test value';
      component.control.setValue(testValue);
      fixture.detectChanges();
      
      
      await fixture.whenStable();
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.nativeElement.value).toBe(testValue);
    });

    it('should update FormControl when input value changes', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      const testValue = 'new value';
      
      inputElement.nativeElement.value = testValue;
      inputElement.nativeElement.dispatchEvent(new Event('input'));
      
      expect(component.control.value).toBe(testValue);
    });

    it('should handle different input types correctly', () => {
      const types: Array<'text' | 'email' | 'password' | 'number' | 'tel'> = 
        ['text', 'email', 'password', 'number', 'tel'];
      
      types.forEach(type => {
        component.type = type;
        fixture.detectChanges();
        
        const inputElement = fixture.debugElement.query(By.css('input'));
        expect(inputElement.nativeElement.type).toBe(type);
      });
    });

    it('should handle FormControl validation states', () => {
      
      component.control.setValue('valid@email.com');
      component.control.markAsTouched();
      expect(component.error).toBeNull();
      
      
      component.control.setErrors({ message: 'Invalid email' });
      expect(component.error).toBe('Invalid email');
    });

    it('should return null when control is not touched', () => {
      component.control.setErrors({ message: 'Some error' });
      component.control.markAsUntouched();
      
      expect(component.error).toBeNull();
    });

    it('should return null when control has no errors', () => {
      component.control.markAsTouched();
      component.control.setErrors(null);
      
      expect(component.error).toBeNull();
    });

    it('should return null when error message is not a string', () => {
      component.control.markAsTouched();
      component.control.setErrors({ message: 123 });
      
      expect(component.error).toBeNull();
    });

    it('should return null when error has no message property', () => {
      component.control.markAsTouched();
      component.control.setErrors({ required: true });
      
      expect(component.error).toBeNull();
    });
  });

  describe('onBlur Method', () => {
    it('should call markAsTouched and updateValueAndValidity when control exists', () => {
      spyOn(component.control, 'markAsTouched');
      spyOn(component.control, 'updateValueAndValidity');
      
      component.onBlur();
      
      expect(component.control.markAsTouched).toHaveBeenCalled();
      expect(component.control.updateValueAndValidity).toHaveBeenCalled();
    });

    it('should emit blurEvent when fieldName is defined', () => {
      spyOn(component.blurEvent, 'emit');
      component.fieldName = 'testField';
      
      component.onBlur();
      
      expect(component.blurEvent.emit).toHaveBeenCalledWith('testField');
    });

    it('should not emit blurEvent when fieldName is undefined', () => {
      spyOn(component.blurEvent, 'emit');
      component.fieldName = undefined;
      
      component.onBlur();
      
      expect(component.blurEvent.emit).not.toHaveBeenCalled();
    });

    it('should handle onBlur when control is null', () => {
      component.control = null as unknown as FormControl;
      
      expect(() => {
        component.onBlur();
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null FormControl gracefully', () => {
      component.control = null as unknown as FormControl;
      expect(() => {
        const error = component.error;
        expect(error).toBeNull();
      }).not.toThrow();
    });

    it('should handle undefined FormControl gracefully', () => {
      component.control = undefined as unknown as FormControl;
      expect(() => {
        const error = component.error;
        expect(error).toBeNull();
      }).not.toThrow();
    });

    it('should handle empty string values', () => {
      component.control.setValue('');
      component.label = '';
      component.placeholder = '';
      
      expect(component.control.value).toBe('');
      expect(component.label).toBe('');
      expect(component.placeholder).toBe('');
    });

    it('should handle special characters in all string inputs', () => {
      const specialChars = 'àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿ';
      
      component.label = specialChars;
      component.placeholder = specialChars;
      component.control.setValue(specialChars);
      
      expect(component.label).toBe(specialChars);
      expect(component.placeholder).toBe(specialChars);
      expect(component.control.value).toBe(specialChars);
    });
  });
});