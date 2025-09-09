import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

import { NumberInputComponent } from './number-input.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('NumberInputComponent', () => {
  let component: NumberInputComponent;
  let fixture: ComponentFixture<NumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputComponent, WrapperComponent, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    component.control = new FormControl(0);
    component.label = 'Test Number Input';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = TestBed.createComponent(NumberInputComponent).componentInstance;
      newComponent.control = new FormControl(0);
      
      expect(newComponent.label).toBe('');
      expect(newComponent.placeholder).toBe('');
      expect(newComponent.numberType).toBe('decimal');
      expect(newComponent.step).toBe(1);
      expect(newComponent.decimalPlaces).toBe(2);
      expect(newComponent.currencySymbol).toBe('R$');
      expect(newComponent.disabled).toBe(false);
    });

    it('should accept custom input values', () => {
      component.label = 'Custom Label';
      component.placeholder = 'Enter number';
      component.numberType = 'currency';
      component.min = 0;
      component.max = 100;
      component.step = 0.5;
      component.decimalPlaces = 3;
      component.disabled = true;
      
      expect(component.label).toBe('Custom Label');
      expect(component.placeholder).toBe('Enter number');
      expect(component.numberType).toBe('currency');
      expect(component.min).toBe(0);
      expect(component.max).toBe(100);
      expect(component.step).toBe(0.5);
      expect(component.decimalPlaces).toBe(3);
      expect(component.disabled).toBe(true);
    });
  });

  describe('Display Value', () => {
    it('should format integer values correctly', () => {
      component.numberType = 'integer';
      component.control.setValue(10.7);
      
      expect(component.displayValue).toBe('10');
    });

    it('should format decimal values correctly', () => {
      component.numberType = 'decimal';
      component.decimalPlaces = 2;
      component.control.setValue(10.567);
      
      expect(component.displayValue).toBe('10.57');
    });

    it('should format currency values correctly', () => {
      component.numberType = 'currency';
      component.control.setValue(1234.56);
      
      expect(component.displayValue).toContain('1.234,56');
    });

    it('should return empty string for null values', () => {
      component.control.setValue(null);
      
      expect(component.displayValue).toBe('');
    });
  });

  describe('Step Value', () => {
    it('should return 1 for integer type', () => {
      component.numberType = 'integer';
      
      expect(component.stepValue).toBe(1);
    });

    it('should return correct decimal step for decimal type', () => {
      component.numberType = 'decimal';
      component.decimalPlaces = 2;
      
      expect(component.stepValue).toBe(0.01);
    });

    it('should return 0.01 for currency type', () => {
      component.numberType = 'currency';
      
      expect(component.stepValue).toBe(0.01);
    });
  });

  describe('Increment/Decrement', () => {
    it('should increment value correctly', () => {
      component.control.setValue(5);
      component.numberType = 'integer';
      
      component.increment();
      
      expect(component.control.value).toBe(6);
    });

    it('should decrement value correctly', () => {
      component.control.setValue(5);
      component.numberType = 'integer';
      
      component.decrement();
      
      expect(component.control.value).toBe(4);
    });

    it('should not increment beyond max value', () => {
      component.control.setValue(10);
      component.max = 10;
      component.numberType = 'integer';
      
      component.increment();
      
      expect(component.control.value).toBe(10);
    });

    it('should not decrement below min value', () => {
      component.control.setValue(0);
      component.min = 0;
      component.numberType = 'integer';
      
      component.decrement();
      
      expect(component.control.value).toBe(0);
    });

    it('should not increment when disabled', () => {
      component.control.setValue(5);
      component.disabled = true;
      
      component.increment();
      
      expect(component.control.value).toBe(5);
    });

    it('should not decrement when disabled', () => {
      component.control.setValue(5);
      component.disabled = true;
      
      component.decrement();
      
      expect(component.control.value).toBe(5);
    });
  });

  describe('Template Rendering', () => {
    it('should render wrapper component with correct inputs', () => {
      const wrapperElement = fixture.debugElement.query(By.directive(WrapperComponent));
      const wrapperComponent = wrapperElement.componentInstance;

      expect(wrapperComponent.label).toBe('Test Number Input');
      expect(wrapperComponent.inputId).toBe(component.inputId);
    });

    it('should render input element with correct attributes', () => {
      component.placeholder = 'Enter number';
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      
      expect(inputElement.nativeElement.id).toBe(component.inputId);
      expect(inputElement.nativeElement.placeholder).toBe('Enter number');
      expect(inputElement.nativeElement.classList.contains('form-control')).toBe(true);
    });

    it('should render increment and decrement buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      
      expect(buttons.length).toBe(2);
      expect(buttons[0].nativeElement.getAttribute('aria-label')).toContain('Diminuir');
      expect(buttons[1].nativeElement.getAttribute('aria-label')).toContain('Aumentar');
    });

    it('should disable buttons when component is disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      
      expect(buttons[0].nativeElement.disabled).toBe(true);
      expect(buttons[1].nativeElement.disabled).toBe(true);
    });

    it('should disable decrement button at min value', () => {
      component.min = 0;
      component.control.setValue(0);
      fixture.detectChanges();
      
      const decrementButton = fixture.debugElement.queryAll(By.css('button'))[0];
      
      expect(decrementButton.nativeElement.disabled).toBe(true);
    });

    it('should disable increment button at max value', () => {
      component.max = 10;
      component.control.setValue(10);
      fixture.detectChanges();
      
      const incrementButton = fixture.debugElement.queryAll(By.css('button'))[1];
      
      expect(incrementButton.nativeElement.disabled).toBe(true);
    });
  });

  describe('Column Host Class Integration', () => {
    it('should inherit column properties from ColumnHostClass', () => {
      component.col = 6;
      component.colMd = 4;
      component.colLg = 3;
      component.colXl = 2;
      
      expect(component.hostClass).toBe('col-6 col-md-4 col-lg-3 col-xl-2');
    });
  });

  describe('Error Handling', () => {
    it('should display error when control has errors and is touched', () => {
      component.control.setErrors({ message: 'Invalid number' });
      component.control.markAsTouched();
      
      expect(component.error).toBe('Invalid number');
    });

    it('should not display error when control is not touched', () => {
      component.control.setErrors({ message: 'Invalid number' });
      component.control.markAsUntouched();
      
      expect(component.error).toBeNull();
    });
  });
});