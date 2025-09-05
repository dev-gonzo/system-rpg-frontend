import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CheckboxComponent } from './checkbox.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CheckboxComponent,
        ReactiveFormsModule,
        WrapperComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    
    
    component.control = new FormControl(false);
    component.label = 'Teste Checkbox';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values', () => {
      expect(component.label).toBe('Teste Checkbox');
      expect(component.id).toBeUndefined();
    });

    it('should accept input properties', () => {
      component.label = 'Novo Label';
      component.id = 'custom-id';
      
      expect(component.label).toBe('Novo Label');
      expect(component.id).toBe('custom-id');
    });

    it('should require control input', () => {
      
      expect(component.control).toBeDefined();
      expect(component.control instanceof FormControl).toBeTruthy();
    });
  });

  describe('checkboxId getter', () => {
    it('should return custom id when provided', () => {
      component.id = 'custom-checkbox';
      expect(component.checkboxId).toBe('custom-checkbox');
    });

    it('should generate id from label when no custom id', () => {
      component.id = undefined;
      component.label = 'Meu Campo Teste';
      expect(component.checkboxId).toBe('checkbox-meu-campo-teste');
    });

    it('should handle empty label', () => {
      component.id = undefined;
      component.label = '';
      expect(component.checkboxId).toBe('checkbox-');
    });

    it('should handle label with multiple spaces', () => {
      component.id = undefined;
      component.label = 'Campo   Com   Espaços';
      expect(component.checkboxId).toBe('checkbox-campo-com-espaços');
    });

    it('should handle label with special characters', () => {
      component.id = undefined;
      component.label = 'Campo Acentuação Ção';
      expect(component.checkboxId).toBe('checkbox-campo-acentuação-ção');
    });
  });

  describe('error getter', () => {
    it('should return null when control is not touched', () => {
      component.control.setErrors({ message: 'Erro teste' });
      expect(component.error).toBeNull();
    });

    it('should return null when control has no errors', () => {
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return error message when control is touched and has errors', () => {
      component.control.setErrors({ message: 'Campo obrigatório' });
      component.control.markAsTouched();
      expect(component.error).toBe('Campo obrigatório');
    });

    it('should return null when error is not a string', () => {
      component.control.setErrors({ message: { complex: 'object' } });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return null when control is null', () => {
      component.control = null!;
      expect(component.error).toBeNull();
    });

    it('should return null when control is undefined', () => {
      component.control = undefined!;
      expect(component.error).toBeNull();
    });

    it('should return null when errors object does not have message property', () => {
      component.control.setErrors({ required: true });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return null when message property is null', () => {
      component.control.setErrors({ message: null });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return null when message property is undefined', () => {
      component.control.setErrors({ message: undefined });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return null when message property is a number', () => {
      component.control.setErrors({ message: 123 });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });

    it('should return null when message property is a boolean', () => {
      component.control.setErrors({ message: true });
      component.control.markAsTouched();
      expect(component.error).toBeNull();
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render checkbox input with correct attributes', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      
      expect(checkbox.nativeElement.id).toBe(component.checkboxId);
      expect(checkbox.nativeElement.type).toBe('checkbox');
      expect(checkbox.nativeElement.classList.contains('form-check-input')).toBeTrue();
    });

    it('should pass label to wrapper component', () => {
      const wrapper = fixture.debugElement.query(By.directive(WrapperComponent));
      expect(wrapper.componentInstance.label).toBe(component.label);
    });

    it('should render wrapper component with correct inputs', () => {
      const wrapper = fixture.debugElement.query(By.directive(WrapperComponent));
      
      expect(wrapper.componentInstance.label).toBe(component.label);
      expect(wrapper.componentInstance.error).toBe(component.error);
      expect(wrapper.componentInstance.inputId).toBe(component.checkboxId);
    });

    it('should bind FormControl to checkbox input', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      
      
      expect(checkbox.nativeElement.checked).toBeFalse();
      
      
      component.control.setValue(true);
      fixture.detectChanges();
      
      expect(checkbox.nativeElement.checked).toBeTrue();
    });

    it('should update FormControl when checkbox is clicked', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      
      
      expect(component.control.value).toBeFalse();
      
      
      checkbox.nativeElement.click();
      fixture.detectChanges();
      
      expect(component.control.value).toBeTrue();
    });

    it('should add text-danger class to label when has error', () => {
      component.control.setErrors({ message: 'Erro' });
      component.control.markAsTouched();
      fixture.detectChanges();
      
      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.classList.contains('text-danger')).toBeTrue();
    });

    it('should not add text-danger class to label when no error', () => {
      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.classList.contains('text-danger')).toBeFalse();
    });

    it('should render form-check container', () => {
      const formCheck = fixture.debugElement.query(By.css('.form-check'));
      expect(formCheck).toBeTruthy();
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

    it('should handle null column values', () => {
      component.col = null;
      component.colMd = null;
      component.colLg = null;
      component.colXl = null;
      
      expect(component.hostClass).toBe('');
    });

    it('should handle mixed column values', () => {
      component.col = 12;
      component.colMd = null;
      component.colLg = 6;
      component.colXl = null;
      
      expect(component.hostClass).toBe('col-12 col-lg-6');
    });

    it('should handle string column values', () => {
      component.col = 'auto';
      component.colMd = '6';
      
      expect(component.hostClass).toBe('col-auto col-md-6');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper label association', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      const label = fixture.debugElement.query(By.css('label'));
      
      expect(checkbox.nativeElement.id).toBe(label.nativeElement.getAttribute('for'));
    });

    it('should be keyboard accessible', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      
      
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      checkbox.nativeElement.dispatchEvent(spaceEvent);
      
      
      expect(checkbox.nativeElement).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle FormControl with null initial value', () => {
      component.control = new FormControl(null);
      fixture.detectChanges();
      
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkbox.nativeElement.checked).toBeFalse();
    });

    it('should handle FormControl with undefined initial value', () => {
      component.control = new FormControl(undefined);
      fixture.detectChanges();
      
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkbox.nativeElement.checked).toBeFalse();
    });

    it('should handle disabled FormControl', () => {
      component.control.disable();
      fixture.detectChanges();
      
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkbox.nativeElement.disabled).toBeTrue();
    });

    it('should handle enabled FormControl', () => {
      component.control.enable();
      fixture.detectChanges();
      
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkbox.nativeElement.disabled).toBeFalse();
    });

    it('should handle very long labels', () => {
      const longLabel = 'Este é um label muito longo que pode quebrar o layout se não for tratado adequadamente pelo componente';
      component.label = longLabel;
      fixture.detectChanges();
      
      const wrapper = fixture.debugElement.query(By.directive(WrapperComponent));
      expect(wrapper.componentInstance.label).toBe(longLabel);
    });

    it('should handle empty label', () => {
      component.label = '';
      fixture.detectChanges();
      
      const wrapper = fixture.debugElement.query(By.directive(WrapperComponent));
      expect(wrapper.componentInstance.label).toBe('');
    });

    it('should handle label with HTML entities', () => {
      component.label = 'Label com & < > " caracteres especiais';
      fixture.detectChanges();
      
      const wrapper = fixture.debugElement.query(By.directive(WrapperComponent));
      expect(wrapper.componentInstance.label).toBe('Label com & < > " caracteres especiais');
    });
  });

  describe('FormControl State Changes', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reflect pristine state', () => {
      expect(component.control.pristine).toBeTrue();
      
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      checkbox.nativeElement.click();
      
      expect(component.control.pristine).toBeFalse();
      expect(component.control.dirty).toBeTrue();
    });

    it('should reflect touched state', () => {
      expect(component.control.touched).toBeFalse();
      
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      checkbox.nativeElement.focus();
      checkbox.nativeElement.blur();
      
      expect(component.control.touched).toBeTrue();
    });

    it('should handle programmatic value changes', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      
      component.control.setValue(true);
      fixture.detectChanges();
      expect(checkbox.nativeElement.checked).toBeTrue();
      
      component.control.setValue(false);
      fixture.detectChanges();
      expect(checkbox.nativeElement.checked).toBeFalse();
    });

    it('should handle reset', () => {
      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      
      
      component.control.setValue(true);
      component.control.markAsTouched();
      fixture.detectChanges();
      
      expect(checkbox.nativeElement.checked).toBeTrue();
      expect(component.control.touched).toBeTrue();
      
      
      component.control.reset();
      fixture.detectChanges();
      
      expect(checkbox.nativeElement.checked).toBeFalse();
      expect(component.control.touched).toBeFalse();
    });
  });
});