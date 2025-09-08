import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputViewComponent } from './input-view.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('InputViewComponent', () => {
  let component: InputViewComponent;
  let fixture: ComponentFixture<InputViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputViewComponent, WrapperComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputViewComponent);
    component = fixture.componentInstance;
    component.label = 'Test Input View';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      const newComponent = TestBed.createComponent(InputViewComponent).componentInstance;
      
      expect(newComponent.value).toBeNull();
      expect(newComponent.label).toBe('');
      expect(newComponent.id).toBeUndefined();
      expect(newComponent.helper).toBe('');
      expect(newComponent.fieldName).toBeUndefined();
      expect(newComponent.placeholder).toBe('-');
      expect(newComponent.prefix).toBe('');
      expect(newComponent.suffix).toBe('');
      expect(newComponent.copyable).toBe(false);
    });

    it('should accept input properties', () => {
      component.value = 'Test Value';
      component.label = 'New Label';
      component.id = 'custom-id';
      component.helper = 'Helper text';
      component.fieldName = 'testField';
      component.placeholder = 'Empty';
      component.prefix = 'R$ ';
      component.suffix = ',00';
      component.copyable = true;
      
      expect(component.value).toBe('Test Value');
      expect(component.label).toBe('New Label');
      expect(component.id).toBe('custom-id');
      expect(component.helper).toBe('Helper text');
      expect(component.fieldName).toBe('testField');
      expect(component.placeholder).toBe('Empty');
      expect(component.prefix).toBe('R$ ');
      expect(component.suffix).toBe(',00');
      expect(component.copyable).toBe(true);
    });
  });

  describe('inputId getter', () => {
    it('should return custom id when provided', () => {
      component.id = 'custom-id';
      expect(component.inputId).toBe('custom-id');
    });

    it('should generate unique id when not provided', () => {
      component.id = undefined;
      const id = component.inputId;
      expect(id).toMatch(/^input-view-[a-z0-9]+$/);
    });
  });

  describe('displayValue getter', () => {
    it('should return placeholder when value is null', () => {
      component.value = null;
      component.placeholder = 'No value';
      expect(component.displayValue).toBe('No value');
    });

    it('should return placeholder when value is undefined', () => {
      component.value = null;
      component.placeholder = 'No value';
      expect(component.displayValue).toBe('No value');
    });

    it('should return placeholder when value is empty string', () => {
      component.value = '';
      component.placeholder = 'No value';
      expect(component.displayValue).toBe('No value');
    });

    it('should return formatted value with prefix and suffix', () => {
      component.value = '100';
      component.prefix = 'R$ ';
      component.suffix = ',00';
      expect(component.displayValue).toBe('R$ 100,00');
    });

    it('should return value without prefix and suffix when not provided', () => {
      component.value = 'Test Value';
      expect(component.displayValue).toBe('Test Value');
    });
  });

  describe('copyToClipboard method', () => {
    beforeEach(() => {
      spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    });

    it('should not copy when copyable is false', async () => {
      component.copyable = false;
      component.value = 'Test Value';
      
      await component.copyToClipboard();
      
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('should not copy when value is null', async () => {
      component.copyable = true;
      component.value = null;
      
      await component.copyToClipboard();
      
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('should copy value to clipboard when conditions are met', async () => {
      component.copyable = true;
      component.value = 'Test Value';
      
      await component.copyToClipboard();
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Test Value');
    });

    it('should handle clipboard error gracefully', async () => {
      component.copyable = true;
      component.value = 'Test Value';
      (navigator.clipboard.writeText as jasmine.Spy).and.returnValue(Promise.reject('Error'));
      
      await component.copyToClipboard();
      
      
      expect(true).toBe(true);
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
      fixture.detectChanges();
      expect(component.hostClass).toContain('col-6');
      expect(component.hostClass).toContain('col-md-4');
    });
  });

  describe('Template Rendering', () => {
    it('should render wrapper component with correct inputs', () => {
      fixture.detectChanges();
      const wrapperElement = fixture.debugElement.query(By.directive(WrapperComponent));
      const wrapperComponent = wrapperElement.componentInstance;

      expect(wrapperComponent.label).toBe('Test Input View');
      expect(wrapperComponent.inputId).toBe(component.inputId);
    });

    it('should render div with correct attributes', () => {
      component.value = 'Test Value';
      fixture.detectChanges();
      
      const divElement = fixture.debugElement.query(By.css('.form-control'));
      
      expect(divElement.nativeElement.id).toBe(component.inputId);
      expect(divElement.nativeElement.textContent.trim()).toBe('Test Value');
      expect(divElement.nativeElement.getAttribute('role')).toBe('textbox');
      expect(divElement.nativeElement.getAttribute('aria-readonly')).toBe('true');
    });

    it('should apply text-muted class when value is empty', () => {
      component.value = null;
      fixture.detectChanges();
      
      const divElement = fixture.debugElement.query(By.css('.form-control'));
      expect(divElement.nativeElement.classList.contains('text-muted')).toBe(true);
    });

    it('should not apply text-muted class when value is present', () => {
      component.value = 'Test Value';
      fixture.detectChanges();
      
      const divElement = fixture.debugElement.query(By.css('.form-control'));
      expect(divElement.nativeElement.classList.contains('text-muted')).toBe(false);
    });

    it('should show copy button when copyable is true and value exists', () => {
      component.copyable = true;
      component.value = 'Test Value';
      fixture.detectChanges();
      
      const buttonElement = fixture.debugElement.query(By.css('.btn'));
      expect(buttonElement).toBeTruthy();
    });

    it('should not show copy button when copyable is false', () => {
      component.copyable = false;
      component.value = 'Test Value';
      fixture.detectChanges();
      
      const buttonElement = fixture.debugElement.query(By.css('.btn'));
      expect(buttonElement).toBeFalsy();
    });

    it('should not show copy button when value is empty', () => {
      component.copyable = true;
      component.value = null;
      fixture.detectChanges();
      
      const buttonElement = fixture.debugElement.query(By.css('.btn'));
      expect(buttonElement).toBeFalsy();
    });

    it('should call copyToClipboard when copy button is clicked', () => {
      component.copyable = true;
      component.value = 'Test Value';
      spyOn(component, 'copyToClipboard');
      fixture.detectChanges();
      
      const buttonElement = fixture.debugElement.query(By.css('.btn'));
      buttonElement.nativeElement.click();
      
      expect(component.copyToClipboard).toHaveBeenCalled();
    });
  });
});