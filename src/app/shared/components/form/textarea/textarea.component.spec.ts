import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TextareaComponent } from './textarea.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaComponent, WrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    component.label = 'Test Textarea';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = TestBed.createComponent(TextareaComponent).componentInstance;
      newComponent.control = new FormControl('');
      
      expect(newComponent.label).toBe('');
      expect(newComponent.placeholder).toBe('');
      expect(newComponent.id).toBeUndefined();
      expect(newComponent.autocomplete).toBe('off');
      expect(newComponent.helper).toBe('');
      expect(newComponent.fieldName).toBeUndefined();
      expect(newComponent.rows).toBe(3);
      expect(newComponent.cols).toBeUndefined();
      expect(newComponent.maxlength).toBeUndefined();
      expect(newComponent.minlength).toBeUndefined();
      expect(newComponent.resize).toBe('vertical');
    });

    it('should accept custom input values', () => {
      component.label = 'Custom Label';
      component.placeholder = 'Custom Placeholder';
      component.rows = 5;
      component.cols = 50;
      component.maxlength = 500;
      component.minlength = 10;
      component.resize = 'both';
      
      expect(component.label).toBe('Custom Label');
      expect(component.placeholder).toBe('Custom Placeholder');
      expect(component.rows).toBe(5);
      expect(component.cols).toBe(50);
      expect(component.maxlength).toBe(500);
      expect(component.minlength).toBe(10);
      expect(component.resize).toBe('both');
    });
  });

  describe('inputId getter', () => {
    it('should return custom id when provided', () => {
      component.id = 'custom-textarea-id';
      expect(component.inputId).toBe('custom-textarea-id');
    });

    it('should generate id from label when id is not provided', () => {
      component.id = undefined;
      component.label = 'Test Label';
      expect(component.inputId).toBe('textarea-test-label');
    });

    it('should handle empty label', () => {
      component.id = undefined;
      component.label = '';
      expect(component.inputId).toBe('textarea-');
    });

    it('should handle special characters in label', () => {
      component.id = undefined;
      component.label = 'Test@Label#With$Special%Characters';
      expect(component.inputId).toBe('textarea-test@label#with$special%characters');
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

      expect(wrapperComponent.label).toBe('Test Textarea');
      expect(wrapperComponent.inputId).toBe(component.inputId);
    });

    it('should render textarea element with correct attributes', () => {
      component.placeholder = 'Enter text';
      component.rows = 5;
      component.cols = 50;
      component.maxlength = 500;
      component.minlength = 10;
      component.resize = 'both';
      fixture.detectChanges();
      
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      
      expect(textareaElement.nativeElement.id).toBe(component.inputId);
      expect(textareaElement.nativeElement.placeholder).toBe('Enter text');
      expect(textareaElement.nativeElement.rows).toBe(5);
      expect(textareaElement.nativeElement.cols).toBe(50);
      expect(textareaElement.nativeElement.maxLength).toBe(500);
      expect(textareaElement.nativeElement.minLength).toBe(10);
      expect(textareaElement.nativeElement.classList.contains('form-control')).toBe(true);
    });

    it('should apply is-invalid class when there is an error', () => {
      component.control.setErrors({ message: 'Error' });
      component.control.markAsTouched();
      fixture.detectChanges();
      
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      expect(textareaElement.nativeElement.classList.contains('is-invalid')).toBe(true);
    });

    it('should not apply is-invalid class when there is no error', () => {
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      expect(textareaElement.nativeElement.classList.contains('is-invalid')).toBe(false);
    });

    it('should apply correct resize style', () => {
      component.resize = 'none';
      fixture.detectChanges();
      
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      expect(textareaElement.nativeElement.style.resize).toBe('none');
    });
  });

  describe('Event Handling', () => {
    it('should emit blurEvent when textarea loses focus and fieldName is provided', () => {
      spyOn(component.blurEvent, 'emit');
      component.fieldName = 'testField';
      
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      textareaElement.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(component.blurEvent.emit).toHaveBeenCalledWith('testField');
    });

    it('should not emit blurEvent when fieldName is not provided', () => {
      spyOn(component.blurEvent, 'emit');
      component.fieldName = undefined;
      
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      textareaElement.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(component.blurEvent.emit).not.toHaveBeenCalled();
    });

    it('should mark control as touched on blur', () => {
      spyOn(component.control, 'markAsTouched');
      
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      textareaElement.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(component.control.markAsTouched).toHaveBeenCalled();
    });
  });

  describe('FormControl Integration', () => {
    it('should bind to FormControl value', async () => {
      const testValue = 'test value';
      component.control.setValue(testValue);
      fixture.detectChanges();
      
      await fixture.whenStable();
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      expect(textareaElement.nativeElement.value).toBe(testValue);
    });

    it('should update FormControl when textarea value changes', () => {
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      const testValue = 'new value';
      
      textareaElement.nativeElement.value = testValue;
      textareaElement.nativeElement.dispatchEvent(new Event('input'));
      
      expect(component.control.value).toBe(testValue);
    });

    it('should handle FormControl validation states', () => {
      
      component.control.setValue('valid text');
      component.control.markAsTouched();
      expect(component.error).toBeNull();
      
      
      component.control.setErrors({ message: 'Invalid text' });
      expect(component.error).toBe('Invalid text');
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
  });

  describe('Focus Method', () => {
    it('should focus the textarea element when focus() is called', () => {
      const textareaElement = fixture.debugElement.query(By.css('textarea'));
      spyOn(textareaElement.nativeElement, 'focus');
      
      component.focus();
      
      expect(textareaElement.nativeElement.focus).toHaveBeenCalled();
    });
  });
});