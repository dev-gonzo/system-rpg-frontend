import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';


import { DatepickerComponent } from './datepicker.component';
import { WrapperComponent } from '../wrapper/wrapper.component';

interface CalendarDay {
  day: number;
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
}

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerComponent, WrapperComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    component.control = new FormControl<Date | string | null>(null);
    component.label = 'Data de Teste';
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.placeholder).toBe('DD/MM/AAAA');
      expect(component.dateFormat).toBe('dd/mm/yyyy');
      expect(component.showButtonBar).toBeFalse();
      expect(component.showIcon).toBeTrue();
      expect(component.showCalendar).toBeFalse();
      expect(component.currentViewMode).toBe('days');
      expect(component.weekDays).toEqual(['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
    });

    it('should accept input properties', () => {
      const testControl = new FormControl('2023-12-25');
      const minDate = new Date('2023-01-01');
      const maxDate = new Date('2023-12-31');
      
      component.control = testControl;
      component.label = 'Test Label';
      component.placeholder = 'Test Placeholder';
      component.minDate = minDate;
      component.maxDate = maxDate;
      component.dateFormat = 'dd/mm/yyyy';
      
      expect(component.control).toBe(testControl);
      expect(component.label).toBe('Test Label');
      expect(component.placeholder).toBe('Test Placeholder');
      expect(component.minDate).toBe(minDate);
      expect(component.maxDate).toBe(maxDate);
      expect(component.dateFormat).toBe('dd/mm/yyyy');
    });

    it('should handle control value changes', () => {
      const testDate = '2023-12-25';
      component.control.setValue(testDate);
      
      expect(component.control.value).toBe(testDate);
    });

    it('should handle control disabled state', () => {
      component.control.disable();
      expect(component.control.disabled).toBeTrue();
      
      component.control.enable();
      expect(component.control.disabled).toBeFalse();
    });

    it('should set properties correctly', () => {
      component.label = 'Nova Data';
      component.placeholder = 'Selecione uma data';
      component.id = 'custom-id';
      component.dateFormat = 'mm/dd/yyyy';
      component.showButtonBar = true;
      component.showIcon = false;
      
      expect(component.label).toBe('Nova Data');
      expect(component.placeholder).toBe('Selecione uma data');
      expect(component.id).toBe('custom-id');
      expect(component.dateFormat).toBe('mm/dd/yyyy');
      expect(component.showButtonBar).toBeTrue();
      expect(component.showIcon).toBeFalse();
    });

    it('should require control input', () => {
      expect(component.control).toBeDefined();
      expect(component.control instanceof FormControl).toBeTruthy();
    });
  });

  describe('Getters', () => {
    describe('inputId', () => {
      it('should return custom id when provided', () => {
        component.id = 'custom-datepicker';
        expect(component.inputId).toBe('custom-datepicker');
      });

      it('should generate id from label when no custom id', () => {
        component.id = undefined;
        component.label = 'Data de Nascimento';
        expect(component.inputId).toBe('datepicker-data-de-nascimento');
      });

      it('should handle empty label', () => {
        component.id = undefined;
        component.label = '';
        expect(component.inputId).toBe('datepicker-');
      });
    });

    describe('error', () => {
      it('should return null when control is not touched', () => {
        component.control.setErrors({ message: 'Erro de teste' });
        expect(component.error).toBeNull();
      });

      it('should return null when control has no errors', () => {
        component.control.markAsTouched();
        expect(component.error).toBeNull();
      });

      it('should return error message when control is touched and has errors', () => {
        component.control.setErrors({ message: 'Data inválida' });
        component.control.markAsTouched();
        expect(component.error).toBe('Data inválida');
      });

      it('should return null when error is not a string', () => {
        component.control.setErrors({ message: { invalid: true } });
        component.control.markAsTouched();
        expect(component.error).toBeNull();
      });
    });

    describe('displayValue', () => {
      it('should return empty string when control value is null', () => {
        component.control.setValue(null);
        expect(component.displayValue).toBe('');
      });

      it('should return empty string when control value is undefined', () => {
        component.control.setValue(null);
        expect(component.displayValue).toBe('');
      });

      it('should return string value when it matches date pattern', () => {
        component.control.setValue('25/12/2023');
        expect(component.displayValue).toBe('25/12/2023');
      });

      it('should return partial string value during typing', () => {
        component.control.setValue('25/12');
        expect(component.displayValue).toBe('25/12');
      });

      it('should format Date object to string', () => {
        const testDate = new Date(2023, 11, 25); 
        component.control.setValue(testDate);
        const result = component.displayValue;
        expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      });
    });

    describe('currentMonthName', () => {
      it('should return correct month name', () => {
        component.currentDate = new Date(2023, 0, 15); 
        expect(component.currentMonthName).toBe('janeiro');
        
        component.currentDate = new Date(2023, 11, 15); 
        expect(component.currentMonthName).toBe('dezembro');
      });
    });

    describe('currentYear', () => {
      it('should return current year', () => {
        component.currentDate = new Date(2023, 5, 15);
        expect(component.currentYear).toBe(2023);
        
        component.currentDate = new Date(2024, 0, 1);
        expect(component.currentYear).toBe(2024);
      });
    });
  });

  describe('Calendar Toggle', () => {
    it('should toggle calendar visibility', () => {
      expect(component.showCalendar).toBeFalse();
      
      component.toggleCalendar();
      expect(component.showCalendar).toBeTrue();
      
      component.toggleCalendar();
      expect(component.showCalendar).toBeFalse();
    });

    it('should generate calendar when opening', () => {
      const generateCalendarSpy = spyOn(component as unknown as { generateCalendar: () => void }, 'generateCalendar');
      component.showCalendar = false;
      
      component.toggleCalendar();
      
      expect(generateCalendarSpy).toHaveBeenCalled();
    });
  });

  describe('View Mode Navigation', () => {
    it('should switch to month view', () => {
      component.currentViewMode = 'days';
      component.switchToMonthView();
      expect(component.currentViewMode).toBe('months');
    });

    it('should switch to year view', () => {
      component.currentViewMode = 'days';
      component.switchToYearView();
      expect(component.currentViewMode).toBe('years');
    });

    it('should switch to day view', () => {
      component.currentViewMode = 'months';
      component.switchToDayView();
      expect(component.currentViewMode).toBe('days');
    });

    it('should prevent event propagation when switching views', () => {
      const event = new Event('click');
      spyOn(event, 'stopPropagation');
      
      component.switchToMonthView(event);
      expect(event.stopPropagation).toHaveBeenCalled();
      
      component.switchToYearView(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Date Navigation', () => {
    beforeEach(() => {
      component.currentDate = new Date(2023, 5, 15); 
    });

    it('should navigate to previous month', () => {
      component.previousMonth();
      expect(component.currentDate.getMonth()).toBe(4); 
      expect(component.currentDate.getFullYear()).toBe(2023);
    });

    it('should navigate to next month', () => {
      component.nextMonth();
      expect(component.currentDate.getMonth()).toBe(6); 
      expect(component.currentDate.getFullYear()).toBe(2023);
    });

    it('should navigate to previous year', () => {
      component.previousYear();
      expect(component.currentDate.getFullYear()).toBe(2022);
    });

    it('should navigate to next year', () => {
      component.nextYear();
      expect(component.currentDate.getFullYear()).toBe(2024);
    });

    it('should navigate to previous decade', () => {
      component.currentDecade = { start: 2020, end: 2029 };
      component.previousDecade();
      expect(component.currentDecade.start).toBe(2008);
      expect(component.currentDecade.end).toBe(2017);
    });

    it('should navigate to next decade', () => {
      component.currentDecade = { start: 2020, end: 2029 };
      component.nextDecade();
      expect(component.currentDecade.start).toBe(2032);
      expect(component.currentDecade.end).toBe(2041);
    });
  });

  describe('Date Selection', () => {
    it('should select date and close calendar', () => {
      const testDay = {
        day: 15,
        date: new Date(2023, 5, 15),
        isCurrentMonth: true,
        isSelected: false,
        isToday: false,
        isDisabled: false
      };
      
      component.showCalendar = true;
      component.selectDate(testDay);
      
      expect(component.control.value).toBe('15/06/2023');
      expect(component.showCalendar).toBeFalse();
    });

    it('should not select disabled date', () => {
      const disabledDay = {
        day: 15,
        date: new Date(2023, 5, 15),
        isCurrentMonth: true,
        isSelected: false,
        isToday: false,
        isDisabled: true
      };
      
      const originalValue = component.control.value;
      component.selectDate(disabledDay);
      
      expect(component.control.value).toBe(originalValue);
    });

    it('should select month and switch to day view', () => {
      const testMonth = {
        month: 5,
        name: 'Junho',
        isSelected: false,
        isDisabled: false
      };
      
      component.currentViewMode = 'months';
      component.selectMonth(testMonth);
      
      expect(component.currentDate.getMonth()).toBe(5);
      expect(component.currentViewMode).toBe('days');
    });

    it('should select year and switch to month view', () => {
      const testYear = {
        year: 2024,
        isSelected: false,
        isDisabled: false
      };
      
      component.currentViewMode = 'years';
      component.selectYear(testYear);
      
      expect(component.currentDate.getFullYear()).toBe(2024);
      expect(component.currentViewMode).toBe('months');
    });
  });

  describe('Today and Clear Functions', () => {
    it('should select today date', () => {
      const today = new Date();
      component.selectToday();
      
      const selectedDate = component.control.value as string;
      const expectedDate = today.toLocaleDateString('pt-BR');
      expect(selectedDate).toBe(expectedDate);
      expect(component.showCalendar).toBeFalse();
    });

    it('should clear date', () => {
      component.control.setValue(new Date());
      component.showCalendar = true;
      
      component.clearDate();
      
      expect(component.control.value).toBe('');
      expect(component.showCalendar).toBeFalse();
    });
  });

  describe('Date Validations and Restrictions', () => {
    it('should respect minDate restriction', () => {
      const minDate = new Date('2023-06-01');
      const testDate = new Date('2023-05-15');
      
      component.minDate = minDate;
      component.currentDate = testDate;
      
      expect(component.minDate).toBe(minDate);
      expect(component.currentDate.getTime()).toBeLessThan(minDate.getTime());
    });

    it('should respect maxDate restriction', () => {
      const maxDate = new Date('2023-12-31');
      const testDate = new Date('2024-01-15');
      
      component.maxDate = maxDate;
      component.currentDate = testDate;
      
      expect(component.maxDate).toBe(maxDate);
      expect(component.currentDate.getTime()).toBeGreaterThan(maxDate.getTime());
    });

    it('should handle date within valid range', () => {
      const minDate = new Date('2023-01-01');
      const maxDate = new Date('2023-12-31');
      const validDate = new Date(2023, 5, 15); 
      
      component.minDate = minDate;
      component.maxDate = maxDate;
      
      const validDay: CalendarDay = {
        day: 15,
        date: validDate,
        isCurrentMonth: true,
        isSelected: false,
        isToday: false,
        isDisabled: false
      };
      
      component.selectDate(validDay);
      
      expect(component.control.value).toEqual('15/06/2023');
    });

    it('should handle disabled dates', () => {
       component.control.disable();
       fixture.detectChanges();
       
       const calendarButton = fixture.debugElement.query(By.css('.input-group-text'));
       expect(calendarButton).toBeTruthy();
       
       
       component.showCalendar = false;
       component.toggleCalendar();
       expect(component.showCalendar).toBe(true);
     });
   });

   describe('Template Integration', () => {
     it('should render input element with correct attributes', () => {
       component.placeholder = 'Select date';
       fixture.detectChanges();
       
       const input = fixture.debugElement.query(By.css('input'));
       expect(input).toBeTruthy();
       expect(input.nativeElement.placeholder).toBe('Select date');
     });

     it('should render calendar icon', () => {
       const calendarIcon = fixture.debugElement.query(By.css('mat-icon'));
       expect(calendarIcon).toBeTruthy();
     });

     it('should show/hide calendar dropdown', () => {
       component.showCalendar = false;
       fixture.detectChanges();
       
       let calendar = fixture.debugElement.query(By.css('.datepicker-dropdown'));
       expect(calendar).toBeFalsy();
       
       component.showCalendar = true;
       fixture.detectChanges();
       
       calendar = fixture.debugElement.query(By.css('.datepicker-dropdown'));
       expect(calendar).toBeTruthy();
     });

     it('should render calendar header with navigation', () => {
       component.showCalendar = true;
       fixture.detectChanges();
       
       const header = fixture.debugElement.query(By.css('.datepicker-header'));
       const prevButton = fixture.debugElement.query(By.css('.datepicker-nav .btn:first-child'));
       const nextButton = fixture.debugElement.query(By.css('.datepicker-nav .btn:last-child'));
       
       expect(header).toBeTruthy();
       expect(prevButton).toBeTruthy();
       expect(nextButton).toBeTruthy();
     });

     it('should render calendar days when in days view', () => {
       component.showCalendar = true;
       component.currentViewMode = 'days';
       fixture.detectChanges();
       
       const daysGrid = fixture.debugElement.query(By.css('.datepicker-days'));
       const dayElements = fixture.debugElement.queryAll(By.css('.day'));
       
       expect(daysGrid).toBeTruthy();
       expect(dayElements.length).toBeGreaterThan(0);
     });

     it('should render months when in months view', () => {
       component.showCalendar = true;
       component.switchToMonthView();
       fixture.detectChanges();
       
       const monthsGrid = fixture.debugElement.query(By.css('.datepicker-months'));
       const monthElements = fixture.debugElement.queryAll(By.css('.datepicker-months .month'));
       
       expect(monthsGrid).toBeTruthy();
       expect(monthElements.length).toBe(12);
     });

     it('should render years when in years view', () => {
       component.showCalendar = true;
       component.currentViewMode = 'years';
       fixture.detectChanges();
       
       const yearsGrid = fixture.debugElement.query(By.css('.datepicker-years'));
       const yearElements = fixture.debugElement.queryAll(By.css('.year'));
       
       expect(yearsGrid).toBeTruthy();
       expect(yearElements.length).toBeGreaterThan(0);
     });

     it('should render footer with action buttons', () => {
       component.showCalendar = true;
       fixture.detectChanges();
       
       const footer = fixture.debugElement.query(By.css('.datepicker-footer'));
       const clearButton = fixture.debugElement.query(By.css('.datepicker-footer .btn-secondary'));
       const todayButton = fixture.debugElement.query(By.css('.datepicker-footer .btn-primary'));
       
       expect(footer).toBeTruthy();
       expect(clearButton).toBeTruthy();
       expect(todayButton).toBeTruthy();
     });

     it('should handle input events', () => {
       const input = fixture.debugElement.query(By.css('input'));
       const testValue = '25/12/2023';
       
       input.nativeElement.value = testValue;
       input.nativeElement.dispatchEvent(new Event('input'));
       
       expect(input.nativeElement.value).toBe(testValue);
     });

     it('should handle calendar icon click', () => {
        spyOn(component, 'toggleCalendar');
        
        const calendarIcon = fixture.debugElement.query(By.css('.input-group-text'));
        calendarIcon.nativeElement.click();
        
        expect(component.toggleCalendar).toHaveBeenCalled();
      });
    });

    describe('Input Functionality', () => {
      it('should apply date format', () => {
         component.dateFormat = 'dd/mm/yyyy';
         fixture.detectChanges();
         
         expect(component.dateFormat).toBe('dd/mm/yyyy');
       });

      it('should format date according to specified format', () => {
        component.dateFormat = 'dd/mm/yyyy';
        const testDate = new Date(2023, 11, 25); 
       const testDay: CalendarDay = {
         day: 25,
         date: testDate,
         isCurrentMonth: true,
         isSelected: false,
         isToday: false,
         isDisabled: false
       };
       component.selectDate(testDay);
        
        expect(component.displayValue).toContain('25');
        expect(component.displayValue).toContain('12');
        expect(component.displayValue).toContain('2023');
      });

      it('should parse input date correctly', () => {
        const input = fixture.debugElement.query(By.css('input'));
        expect(input).toBeTruthy();
        const testValue = '25/12/2023';
        
        input.nativeElement.value = testValue;
        input.nativeElement.dispatchEvent(new Event('input'));
        input.nativeElement.dispatchEvent(new Event('blur'));
        
        
        expect(input.nativeElement.value).toBe(testValue);
      });

      it('should handle invalid date input', () => {
        const input = fixture.debugElement.query(By.css('input'));
        expect(input).toBeTruthy();
        const invalidValue = '32/13/2023';
        
        input.nativeElement.value = invalidValue;
        input.nativeElement.dispatchEvent(new Event('input'));
        input.nativeElement.dispatchEvent(new Event('blur'));
        
        
        expect(input.nativeElement.value).toBe(invalidValue);
      });

      it('should handle empty input', () => {
        const input = fixture.debugElement.query(By.css('input'));
        expect(input).toBeTruthy();
        
        input.nativeElement.value = '';
        input.nativeElement.dispatchEvent(new Event('input'));
        input.nativeElement.dispatchEvent(new Event('blur'));
        
        expect(input.nativeElement.value).toBe('');
        expect(component.control.value).toBeFalsy();
      });

      it('should handle focus and blur events', () => {
        const input = fixture.debugElement.query(By.css('input'));
        expect(input).toBeTruthy();
        spyOn(component, 'onBlur');
        
        input.nativeElement.focus();
        fixture.detectChanges();
        
        input.nativeElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        
        expect(component.onBlur).toHaveBeenCalled();
      });

      it('should validate date format on input', () => {
         component.dateFormat = 'dd/mm/yyyy';
        const input = fixture.debugElement.query(By.css('input'));
        expect(input).toBeTruthy();
        
        
        input.nativeElement.value = '25/12/2023';
        input.nativeElement.dispatchEvent(new Event('input'));
        expect(input.nativeElement.value).toBe('25/12/2023');
        
        
        input.nativeElement.value = '2023-12-25';
        input.nativeElement.dispatchEvent(new Event('input'));
        expect(input.nativeElement.value).toBe('20/23/1225');
      });

      it('should handle keyboard navigation', () => {
        component.showCalendar = true;
        fixture.detectChanges();
        
        const input = fixture.debugElement.query(By.css('input'));
        expect(input).toBeTruthy();
        
        
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        input.nativeElement.dispatchEvent(escapeEvent);
        
        
        expect(component.showCalendar).toBe(true);
      });
    });

    describe('Missing Coverage Tests', () => {
      describe('displayValue edge cases', () => {
        it('should handle invalid Date object in displayValue', () => {
          component.control.setValue('invalid-date');
          expect(component.displayValue).toBe('invalid-date');
        });

        it('should handle non-string, non-Date value in displayValue', () => {
          component.control.setValue(null);
          component.control.setValue(123 as unknown as string);
          expect(component.displayValue).toBe('');
        });

        it('should return formatted date string for valid date in displayValue', () => {
    const validDateString = '2023-12-25T12:00:00.000Z';
    component.control.setValue(validDateString);
    const result = component.displayValue;
    expect(result).toBe('25/12/2023');
  });

        it('should handle non-string non-Date values in toggleCalendar', () => {
          component.control.setValue(123 as unknown as string);
          component.toggleCalendar();
          expect(component.showCalendar).toBe(true);
          expect(component.currentViewMode).toBe('days');
        });
      });

      describe('toggleCalendar with existing value', () => {
        it('should set currentDate when opening calendar with Date value', () => {
          const testDate = new Date(2023, 5, 15);
          component.control.setValue(testDate);
          component.showCalendar = false;
          
          component.toggleCalendar();
          
          expect(component.currentDate.getFullYear()).toBe(2023);
          expect(component.currentDate.getMonth()).toBe(5);
        });

        it('should set currentDate when opening calendar with string value', () => {
          component.control.setValue('21/08/2025');
          component.showCalendar = false;
          
          component.toggleCalendar();
          
          expect(component.currentDate.getFullYear()).toBe(2025);
          expect(component.currentDate.getMonth()).toBe(7);
          expect(component.currentDate.getDate()).toBe(1);
        });

        it('should not set currentDate when opening calendar with invalid date', () => {
          const originalDate = new Date(component.currentDate);
          component.control.setValue('invalid-date');
          component.showCalendar = false;
          
          component.toggleCalendar();
          
          expect(component.currentDate.getTime()).toBe(originalDate.getTime());
        });
      });

      describe('onBlur edge cases', () => {
        it('should handle empty string in onBlur', () => {
          component.control.setValue('');
          
          component.onBlur();
          
          expect(component.control.value).toBe('');
        });
      });

      describe('Year navigation in different view modes', () => {
        it('should call previousDecade when in years view', () => {
          component.currentViewMode = 'years';
          spyOn(component, 'previousDecade');
          
          component.previousYear();
          
          expect(component.previousDecade).toHaveBeenCalled();
        });

        it('should call nextDecade when in years view', () => {
          component.currentViewMode = 'years';
          spyOn(component, 'nextDecade');
          
          component.nextYear();
          
          expect(component.nextDecade).toHaveBeenCalled();
        });

        it('should generate months grid when navigating year in months view', () => {
          component.currentViewMode = 'months';
          spyOn(component as unknown as { generateMonthsGrid: () => void }, 'generateMonthsGrid');
          
          component.previousYear();
          
          expect((component as unknown as { generateMonthsGrid: jasmine.Spy }).generateMonthsGrid).toHaveBeenCalled();
        });

        it('should generate months grid when navigating year forward in months view', () => {
          component.currentViewMode = 'months';
          spyOn(component as unknown as { generateMonthsGrid: () => void }, 'generateMonthsGrid');
          
          component.nextYear();
          
          expect((component as unknown as { generateMonthsGrid: jasmine.Spy }).generateMonthsGrid).toHaveBeenCalled();
        });
      });

      describe('Date restrictions', () => {
        it('should disable dates before minDate', () => {
          component.minDate = new Date(2023, 5, 15);
          const testDate = new Date(2023, 5, 10);
          
          const isDisabled = (component as unknown as { isDateDisabled: (date: Date) => boolean }).isDateDisabled(testDate);
          
          expect(isDisabled).toBe(true);
        });

        it('should disable dates after maxDate', () => {
          component.maxDate = new Date(2023, 5, 15);
          const testDate = new Date(2023, 5, 20);
          
          const isDisabled = (component as unknown as { isDateDisabled: (date: Date) => boolean }).isDateDisabled(testDate);
          
          expect(isDisabled).toBe(true);
        });

        it('should disable months before minDate', () => {
          component.minDate = new Date(2023, 5, 15);
          
          const isDisabled = (component as unknown as { isMonthDisabled: (year: number, month: number) => boolean }).isMonthDisabled(2023, 4);
          
          expect(isDisabled).toBe(true);
        });

        it('should disable months after maxDate', () => {
          component.maxDate = new Date(2023, 5, 15);
          
          const isDisabled = (component as unknown as { isMonthDisabled: (year: number, month: number) => boolean }).isMonthDisabled(2023, 6);
          
          expect(isDisabled).toBe(true);
        });

        it('should disable years before minDate year', () => {
          component.minDate = new Date(2023, 5, 15);
          
          const isDisabled = (component as unknown as { isYearDisabled: (year: number) => boolean }).isYearDisabled(2022);
          
          expect(isDisabled).toBe(true);
        });

        it('should disable years after maxDate year', () => {
          component.maxDate = new Date(2023, 5, 15);
          
          const isDisabled = (component as unknown as { isYearDisabled: (year: number) => boolean }).isYearDisabled(2024);
          
          expect(isDisabled).toBe(true);
        });
      });

      describe('Document click handler', () => {
        it('should not close calendar when clicking on month element', () => {
          component.showCalendar = true;
          const mockElement = {
            classList: { contains: jasmine.createSpy().and.returnValue(true) },
            closest: jasmine.createSpy()
          };
          const mockEvent = { target: mockElement };
          
          component.onDocumentClick(mockEvent as unknown as Event);
          
          expect(component.showCalendar).toBe(true);
        });

        it('should close calendar when clicking outside', () => {
          component.showCalendar = true;
          const mockElement = {
            classList: { contains: jasmine.createSpy().and.returnValue(false) },
            closest: jasmine.createSpy().and.returnValue(null)
          };
          const mockEvent = { target: mockElement };
          
          component.onDocumentClick(mockEvent as unknown as Event);
          
          expect(component.showCalendar).toBe(false);
        });
      });
    });
});