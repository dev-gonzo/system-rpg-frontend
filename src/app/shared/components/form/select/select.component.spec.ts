import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SelectComponent, SelectOption } from './select.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let mockOptions: SelectOption[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, WrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;

    mockOptions = [
      { label: 'Opção 1', value: 'opt1' },
      { label: 'Opção 2', value: 'opt2' },
      { label: 'Opção 3', value: 3 }
    ];

    component.control = new FormControl('');
    component.options = mockOptions;
    component.label = 'Test Select';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = TestBed.createComponent(SelectComponent).componentInstance;
      newComponent.control = new FormControl('');
      
      expect(newComponent.label).toBe('');
      expect(newComponent.options).toEqual([]);
      expect(newComponent.placeholder).toBe('Selecione');
      expect(newComponent.id).toBeUndefined();
    });

    it('should accept custom input values', () => {
      component.label = 'Custom Label';
      component.placeholder = 'Custom Placeholder';
      component.id = 'custom-id';
      component.options = mockOptions;

      expect(component.label).toBe('Custom Label');
      expect(component.placeholder).toBe('Custom Placeholder');
      expect(component.id).toBe('custom-id');
      expect(component.options).toEqual(mockOptions);
    });
  });

  describe('selectId getter', () => {
    it('should return custom id when provided', () => {
      component.id = 'custom-select-id';
      expect(component.selectId).toBe('custom-select-id');
    });

    it('should generate id from label when no custom id provided', () => {
      component.id = undefined;
      component.label = 'Test Label';
      expect(component.selectId).toBe('select-test-label');
    });

    it('should handle labels with multiple spaces', () => {
      component.id = undefined;
      component.label = 'Test   Multiple   Spaces';
      expect(component.selectId).toBe('select-test-multiple-spaces');
    });

    it('should handle empty label', () => {
      component.id = undefined;
      component.label = '';
      expect(component.selectId).toBe('select-');
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
  });

  describe('Native Select Behavior', () => {
    it('should bind control value to select element', () => {
      component.control.setValue('opt1');
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      expect(selectElement.nativeElement.value).toBe('opt1');
    });

    it('should update control when select value changes', () => {
      const selectElement = fixture.debugElement.query(By.css('select'));
      selectElement.nativeElement.value = 'opt2';
      selectElement.nativeElement.dispatchEvent(new Event('change'));
      
      expect(component.control.value).toBe('opt2');
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

      expect(wrapperComponent.label).toBe('Test Select');
      expect(wrapperComponent.inputId).toBe(component.selectId);
    });

    it('should render select element with correct attributes', () => {
      const selectElement = fixture.debugElement.query(By.css('select'));
      
      expect(selectElement.nativeElement.id).toBe(component.selectId);
    });

    it('should render placeholder option when no value selected', () => {
      component.control.setValue('');
      component.placeholder = 'Choose an option';
      fixture.detectChanges();

      const placeholderOption = fixture.debugElement.query(By.css('option[disabled]'));
      expect(placeholderOption.nativeElement.textContent.trim()).toBe('Choose an option');
    });

    it('should render all options', () => {
      fixture.detectChanges();

      const optionElements = fixture.debugElement.queryAll(By.css('option:not([disabled])'));
      expect(optionElements.length).toBe(3);
      expect(optionElements[0].nativeElement.textContent.trim()).toBe('Opção 1');
      expect(optionElements[1].nativeElement.textContent.trim()).toBe('Opção 2');
      expect(optionElements[2].nativeElement.textContent.trim()).toBe('Opção 3');
    });

    it('should select correct option when value is set', () => {
      component.control.setValue('opt1');
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('select'));
      expect(selectElement.nativeElement.value).toBe('opt1');
    });
  });





  describe('Form Control Integration', () => {
    it('should mark control as touched on blur', () => {
      const selectElement = fixture.debugElement.query(By.css('select'));
      
      selectElement.triggerEventHandler('blur', null);
      
      expect(component.control.touched).toBe(true);
    });

    it('should update control value when select changes', () => {
      const selectElement = fixture.debugElement.query(By.css('select'));
      
      selectElement.nativeElement.value = 'opt2';
      selectElement.nativeElement.dispatchEvent(new Event('change'));
      
      expect(component.control.value).toBe('opt2');
    });

    it('should handle numeric values correctly', () => {
      const selectElement = fixture.debugElement.query(By.css('select'));
      
      selectElement.nativeElement.value = '3';
      selectElement.nativeElement.dispatchEvent(new Event('change'));
      
      expect(component.control.value).toBe('3');
    });
  });

  describe('CSS Classes', () => {
    it('should apply text-muted class when no value and no error', () => {
      component.control.setValue(null);
      component.control.setErrors(null);
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      expect(selectElement.nativeElement.classList.contains('text-muted')).toBe(true);
    });

    it('should apply is-invalid class when there is an error', () => {
      component.control.setErrors({ message: 'Error' });
      component.control.markAsTouched();
      fixture.detectChanges();
      
      const selectElement = fixture.debugElement.query(By.css('select'));
      expect(selectElement.nativeElement.classList.contains('is-invalid')).toBe(true);
    });
  });
});