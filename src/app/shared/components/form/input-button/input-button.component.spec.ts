import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { InputButtonComponent } from './input-button.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('InputButtonComponent', () => {
  let component: InputButtonComponent;
  let fixture: ComponentFixture<InputButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputButtonComponent, WrapperComponent, NgxMaskDirective],
      providers: [provideNgxMask()]
    }).compileComponents();

    fixture = TestBed.createComponent(InputButtonComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    component.label = 'Test Input Button';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = TestBed.createComponent(InputButtonComponent).componentInstance;
      newComponent.control = new FormControl('');
      
      expect(newComponent.label).toBe('');
      expect(newComponent.placeholder).toBe('');
      expect(newComponent.type).toBe('text');
      expect(newComponent.id).toBeUndefined();
      expect(newComponent.mask).toBeUndefined();
      expect(newComponent.buttonText).toBe('');
      expect(newComponent.buttonIcon).toBe('');
      expect(newComponent.buttonDisabled).toBe(false);
      expect(newComponent.buttonLoading).toBe(false);
    });

    it('should accept custom input values', () => {
      component.label = 'Custom Label';
      component.placeholder = 'Custom Placeholder';
      component.type = 'email';
      component.buttonText = 'Search';
      component.buttonIcon = 'search';
      component.buttonDisabled = true;
      component.buttonLoading = true;
      
      expect(component.label).toBe('Custom Label');
      expect(component.placeholder).toBe('Custom Placeholder');
      expect(component.type).toBe('email');
      expect(component.buttonText).toBe('Search');
      expect(component.buttonIcon).toBe('search');
      expect(component.buttonDisabled).toBe(true);
      expect(component.buttonLoading).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should render wrapper component with correct inputs', () => {
      const wrapperElement = fixture.debugElement.query(By.directive(WrapperComponent));
      const wrapperComponent = wrapperElement.componentInstance;

      expect(wrapperComponent.label).toBe('Test Input Button');
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

    it('should render button with correct attributes', () => {
      component.buttonText = 'Search';
      component.buttonAriaLabel = 'Search button';
      fixture.detectChanges();
      
      const buttonElement = fixture.debugElement.query(By.css('button'));
      
      expect(buttonElement.nativeElement.type).toBe('button');
      expect(buttonElement.nativeElement.classList.contains('btn')).toBe(true);
      expect(buttonElement.nativeElement.classList.contains('btn-outline-secondary')).toBe(true);
      expect(buttonElement.nativeElement.getAttribute('aria-label')).toBe('Search button');
    });

    it('should show button icon when provided', () => {
      component.buttonIcon = 'fas fa-search';
      component.buttonLoading = false;
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('i'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.className).toContain('fas');
      expect(iconElement.nativeElement.className).toContain('fa-search');
    });

    it('should show button text when provided and no icon', () => {
      component.buttonText = 'Search';
      component.buttonIcon = '';
      component.buttonLoading = false;
      fixture.detectChanges();
      
      const textElement = fixture.debugElement.query(By.css('span'));
      expect(textElement).toBeTruthy();
      expect(textElement.nativeElement.textContent.trim()).toBe('Search');
    });

    it('should show loading spinner when buttonLoading is true', () => {
      component.buttonLoading = true;
      fixture.detectChanges();
      
      const spinnerElement = fixture.debugElement.query(By.css('.spinner-border'));
      expect(spinnerElement).toBeTruthy();
      expect(spinnerElement.nativeElement.classList.contains('spinner-border-sm')).toBe(true);
    });

    it('should disable button when buttonDisabled is true', () => {
      component.buttonDisabled = true;
      fixture.detectChanges();
      
      const buttonElement = fixture.debugElement.query(By.css('button'));
      expect(buttonElement.nativeElement.disabled).toBe(true);
    });

    it('should apply is-invalid class when there is an error', () => {
      component.control.setErrors({ message: 'Error' });
      component.control.markAsTouched();
      fixture.detectChanges();
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      expect(inputElement.nativeElement.classList.contains('is-invalid')).toBe(true);
    });
  });

  describe('Event Handling', () => {
    it('should emit buttonClick event when button is clicked', () => {
      spyOn(component.buttonClick, 'emit');
      component.control.setValue('test value');
      
      const buttonElement = fixture.debugElement.query(By.css('button'));
      buttonElement.nativeElement.click();
      
      expect(component.buttonClick.emit).toHaveBeenCalledWith('test value');
    });

    it('should emit blurEvent when input loses focus', () => {
      spyOn(component.blurEvent, 'emit');
      component.control.setValue('test value');
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      inputElement.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(component.blurEvent.emit).toHaveBeenCalledWith('test value');
    });

    it('should not emit blurEvent when input value is empty', () => {
      spyOn(component.blurEvent, 'emit');
      component.control.setValue('');
      
      const inputElement = fixture.debugElement.query(By.css('input'));
      inputElement.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(component.blurEvent.emit).not.toHaveBeenCalled();
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
});