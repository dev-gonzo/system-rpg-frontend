import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { AutocompleteComponent, AutocompleteOption } from './autocomplete.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let mockOptions: AutocompleteOption[];

  beforeEach(async () => {
    mockOptions = [
      { label: 'Opção 1', value: 1 },
      { label: 'Opção 2', value: 2 },
      { label: 'Teste ABC', value: 'abc' },
      { label: 'Outro Teste', value: 'outro' }
    ];

    await TestBed.configureTestingModule({
      imports: [
        AutocompleteComponent,
        ReactiveFormsModule,
        WrapperComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    
    
    component.control = new FormControl('');
    component.options = mockOptions;
    component.label = 'Teste Label';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values', () => {
      expect(component.label).toBe('Teste Label');
      expect(component.placeholder).toBe('Digite para buscar...');
      expect(component.showDropdown).toBeFalse();
      expect(component.filteredOptions).toEqual([]);
    });

    it('should accept input properties', () => {
      component.label = 'Novo Label';
      component.placeholder = 'Novo placeholder';
      component.id = 'custom-id';
      
      expect(component.label).toBe('Novo Label');
      expect(component.placeholder).toBe('Novo placeholder');
      expect(component.id).toBe('custom-id');
    });
  });

  describe('inputId getter', () => {
    it('should return custom id when provided', () => {
      component.id = 'custom-autocomplete';
      expect(component.inputId).toBe('custom-autocomplete');
    });

    it('should generate id from label when no custom id', () => {
      component.id = undefined;
      component.label = 'Meu Campo Teste';
      expect(component.inputId).toBe('autocomplete-meu-campo-teste');
    });

    it('should handle empty label', () => {
      component.id = undefined;
      component.label = '';
      expect(component.inputId).toBe('autocomplete-');
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
  });

  describe('displayLabel getter', () => {
    it('should return label of selected option', () => {
      component.control.setValue(1);
      expect(component.displayLabel).toBe('Opção 1');
    });

    it('should return value when no matching option found', () => {
      component.control.setValue('valor-inexistente');
      expect(component.displayLabel).toBe('valor-inexistente');
    });

    it('should return empty string when control value is null', () => {
      component.control.setValue(null);
      expect(component.displayLabel).toBe('');
    });

    it('should return empty string when control is null', () => {
      component.control = null!;
      expect(component.displayLabel).toBe('');
    });
  });

  describe('ngOnInit', () => {
    it('should initialize filteredOptions with all options', () => {
      component.ngOnInit();
      expect(component.filteredOptions).toEqual(mockOptions);
    });

    it('should set input value when control has initial value', fakeAsync(() => {
      component.control.setValue(2);
      fixture.detectChanges();
      component.ngOnInit();
      tick();
      
      expect(component.inputRef.nativeElement.value).toBe('Opção 2');
    }));

    it('should not set input value when no matching option', fakeAsync(() => {
      component.control.setValue('inexistente');
      fixture.detectChanges();
      component.ngOnInit();
      tick();
      
      expect(component.inputRef.nativeElement.value).toBe('');
    }));
  });

  describe('onInput', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should filter options based on input value', () => {
      const event = { target: { value: 'Opção' } } as unknown as Event;
      component.onInput(event);
      
      expect(component.filteredOptions).toEqual([
        { label: 'Opção 1', value: 1 },
        { label: 'Opção 2', value: 2 }
      ]);
    });

    it('should filter options case insensitively', () => {
      const event = { target: { value: 'teste' } } as unknown as Event;
      component.onInput(event);
      
      expect(component.filteredOptions).toEqual([
        { label: 'Teste ABC', value: 'abc' },
        { label: 'Outro Teste', value: 'outro' }
      ]);
    });

    it('should show dropdown after filtering', () => {
      const event = { target: { value: 'Opção' } } as unknown as Event;
      component.onInput(event);
      
      expect(component.showDropdown).toBeTrue();
    });

    it('should return empty array when no matches', () => {
      const event = { target: { value: 'xyz' } } as unknown as Event;
      component.onInput(event);
      
      expect(component.filteredOptions).toEqual([]);
    });
  });

  describe('selectOption', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should set control value', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      
      expect(component.control.value).toBe(1);
    });

    it('should mark control as touched', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      
      expect(component.control.touched).toBeTrue();
    });

    it('should set input display value', () => {
      const option = mockOptions[0];
      component.selectOption(option);
      
      expect(component.inputRef.nativeElement.value).toBe('Opção 1');
    });

    it('should hide dropdown', () => {
      component.showDropdown = true;
      const option = mockOptions[0];
      component.selectOption(option);
      
      expect(component.showDropdown).toBeFalse();
    });
  });

  describe('onFocus', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should reset filteredOptions to all options', () => {
      component.filteredOptions = [mockOptions[0]];
      component.onFocus();
      
      expect(component.filteredOptions).toEqual(mockOptions);
    });

    it('should show dropdown', () => {
      component.showDropdown = false;
      component.onFocus();
      
      expect(component.showDropdown).toBeTrue();
    });
  });

  describe('onBlur', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should hide dropdown after timeout', fakeAsync(() => {
      component.showDropdown = true;
      component.onBlur();
      
      expect(component.showDropdown).toBeTrue(); 
      tick(150);
      expect(component.showDropdown).toBeFalse(); 
    }));

    it('should mark control as touched after timeout', fakeAsync(() => {
      component.onBlur();
      
      expect(component.control.touched).toBeFalse(); 
      tick(150);
      expect(component.control.touched).toBeTrue(); 
    }));
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render input with correct attributes', () => {
      const input = fixture.debugElement.query(By.css('input'));
      
      expect(input.nativeElement.id).toBe(component.inputId);
      expect(input.nativeElement.placeholder).toBe(component.placeholder);
      expect(input.nativeElement.type).toBe('text');
    });

    it('should render wrapper component with correct inputs', () => {
      const wrapper = fixture.debugElement.query(By.directive(WrapperComponent));
      
      expect(wrapper.componentInstance.label).toBe(component.label);
      expect(wrapper.componentInstance.inputId).toBe(component.inputId);
    });

    it('should show dropdown when showDropdown is true and has options', () => {
      component.showDropdown = true;
      component.filteredOptions = mockOptions;
      fixture.detectChanges();
      
      const dropdown = fixture.debugElement.query(By.css('.custom-select-dropdown'));
      expect(dropdown).toBeTruthy();
    });

    it('should hide dropdown when showDropdown is false', () => {
      component.showDropdown = false;
      fixture.detectChanges();
      
      const dropdown = fixture.debugElement.query(By.css('.custom-select-dropdown'));
      expect(dropdown).toBeFalsy();
    });

    it('should hide dropdown when no filtered options', () => {
      component.showDropdown = true;
      component.filteredOptions = [];
      fixture.detectChanges();
      
      const dropdown = fixture.debugElement.query(By.css('.custom-select-dropdown'));
      expect(dropdown).toBeFalsy();
    });

    it('should render all filtered options', () => {
      component.showDropdown = true;
      component.filteredOptions = mockOptions.slice(0, 2);
      fixture.detectChanges();
      
      const options = fixture.debugElement.queryAll(By.css('.custom-select-option'));
      expect(options.length).toBe(2);
      expect(options[0].nativeElement.textContent.trim()).toBe('Opção 1');
      expect(options[1].nativeElement.textContent.trim()).toBe('Opção 2');
    });

    it('should add is-invalid class when has error', () => {
      component.control.setErrors({ message: 'Erro' });
      component.control.markAsTouched();
      fixture.detectChanges();
      
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.classList.contains('is-invalid')).toBeTrue();
    });

    it('should show rotated arrow when dropdown is open', () => {
      component.showDropdown = true;
      fixture.detectChanges();
      
      const arrow = fixture.debugElement.query(By.css('.autocomplete-arrow'));
      expect(arrow.nativeElement.classList.contains('rotated')).toBeTrue();
    });
  });

  describe('Event Handlers', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call onInput when input event is triggered', () => {
      spyOn(component, 'onInput');
      const input = fixture.debugElement.query(By.css('input'));
      
      input.nativeElement.value = 'test';
      input.nativeElement.dispatchEvent(new Event('input'));
      
      expect(component.onInput).toHaveBeenCalled();
    });

    it('should call onFocus when focus event is triggered', () => {
      spyOn(component, 'onFocus');
      const input = fixture.debugElement.query(By.css('input'));
      
      input.nativeElement.dispatchEvent(new Event('focus'));
      
      expect(component.onFocus).toHaveBeenCalled();
    });

    it('should call onBlur when blur event is triggered', () => {
      spyOn(component, 'onBlur');
      const input = fixture.debugElement.query(By.css('input'));
      
      input.nativeElement.dispatchEvent(new Event('blur'));
      
      expect(component.onBlur).toHaveBeenCalled();
    });

    it('should call selectOption when option is clicked', () => {
      spyOn(component, 'selectOption');
      component.showDropdown = true;
      component.filteredOptions = [mockOptions[0]];
      fixture.detectChanges();
      
      const option = fixture.debugElement.query(By.css('.custom-select-option'));
      option.nativeElement.click();
      
      expect(component.selectOption).toHaveBeenCalledWith(mockOptions[0]);
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
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      component.options = [];
      component.ngOnInit();
      
      expect(component.filteredOptions).toEqual([]);
    });

    it('should handle null input in onInput', () => {
      const event = { target: { value: null } } as unknown as Event;
      component.onInput(event);
      
      expect(component.filteredOptions).toEqual([]);
      expect(component.showDropdown).toBeTrue();
    });

    it('should handle undefined input in onInput', () => {
      const event = { target: { value: undefined } } as unknown as Event;
      component.onInput(event);
      
      expect(component.filteredOptions).toEqual([]);
      expect(component.showDropdown).toBeTrue();
    });

    it('should handle options with special characters in labels', () => {
      const specialOptions = [
        { label: 'Opção com acentos: ção', value: 1 },
        { label: 'Símbolos: @#$%', value: 2 }
      ];
      component.options = specialOptions;
      component.ngOnInit();
      
      const event = { target: { value: 'ção' } } as unknown as Event;
      component.onInput(event);
      
      expect(component.filteredOptions).toEqual([specialOptions[0]]);
    });
  });
});