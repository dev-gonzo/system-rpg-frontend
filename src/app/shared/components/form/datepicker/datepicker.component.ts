import { CommonModule } from '@angular/common';
import { Component, Input, HostListener, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { ColumnHostClass } from '../../abstract/ColumnHostClass';
import { WrapperComponent } from '../wrapper/wrapper.component';

interface CalendarDay {
  day: number;
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
}

interface CalendarMonth {
  month: number;
  name: string;
  isSelected: boolean;
  isDisabled: boolean;
}

interface CalendarYear {
  year: number;
  isSelected: boolean;
  isDisabled: boolean;
}

type ViewMode = 'days' | 'months' | 'years';

@Component({
  selector: 'app-form-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WrapperComponent,
    MatIconModule
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent extends ColumnHostClass {

  @Input({ required: true }) control!: FormControl<Date | string | null>;
  @Input() label = '';
  @Input() placeholder = 'DD/MM/AAAA';
  @Input() id?: string;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() dateFormat = 'dd/mm/yyyy';
  @Input() showButtonBar = false;
  @Input() showIcon = true;
  @Input() helper: string = '';

  @ViewChild('datepickerContainer', { static: false }) datepickerContainer!: ElementRef;
  @ViewChild('dropdownElement', { static: false }) dropdownElement!: ElementRef;

  showCalendar = false;
  currentDate = new Date();
  currentViewMode: ViewMode = 'days';
  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  calendarDays: CalendarDay[] = [];
  calendarMonths: CalendarMonth[] = [];
  calendarYears: CalendarYear[] = [];
  currentDecade = { start: 0, end: 0 };
  dropdownPosition = { up: false, right: false };

  constructor() {
    super();
    this.generateCalendar();
  }

  get inputId(): string {
    return this.id ?? `datepicker-${this.label.toLowerCase().replace(/\s+/g, '-')}`;
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) return null;
    const errors = this.control.errors;
    return typeof errors['message'] === 'string' ? errors['message'] : null;
  }

  get displayValue(): string {
    if (!this.control?.value) return '';
    
    const value = this.control.value;
    
    
    if (typeof value !== 'string' && !(value instanceof Date)) {
      return '';
    }
    
    if (typeof value === 'string' && /^\d{0,2}\/?\d{0,2}\/?\d{0,4}$/.test(value)) {
      return value;
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString('pt-BR');
    }
    
    
    const date = new Date(value);
    
    if (isNaN(date.getTime())) return typeof value === 'string' ? value : '';
    
    
    return date.toLocaleDateString('pt-BR');
  }

  get currentMonthName(): string {
    return this.currentDate.toLocaleDateString('pt-BR', { 
      month: 'long'
    });
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.currentViewMode = 'days';
      
      if (this.control?.value) {
        const selectedDate = this.parseControlValue(this.control.value);
        
        if (!isNaN(selectedDate.getTime())) {
          this.currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        }
      }
      this.generateCalendar();
      
      
      setTimeout(() => this.calculateDropdownPosition(), 0);
    }
  }

  private parseControlValue(value: Date | string): Date {
    if (value instanceof Date) {
      return value;
    }
    
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; 
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return new Date(value);
    }
    
    return new Date(value);
  }

  switchToMonthView(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.currentViewMode = 'months';
    this.generateMonthsGrid();
  }

  switchToYearView(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.currentViewMode = 'years';
    this.generateYearsGrid();
  }

  switchToDayView(): void {
    this.currentViewMode = 'days';
    this.generateCalendar();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    
    const maskedValue = this.applyDateMask(value);
    target.value = maskedValue;
    
    
    this.control.setValue(maskedValue);
    
    
    if (maskedValue.length === 10) {
      const parsedDate = this.parseDate(maskedValue);
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        this.currentDate = new Date(parsedDate);
        this.generateCalendar();
      }
    }
  }

  onBlur(): void {
    setTimeout(() => {
      
      const activeElement = document.activeElement as HTMLElement;
      const isInsideCalendar = activeElement?.closest('.datepicker-dropdown') || 
                              activeElement?.closest('.datepicker-nav') ||
                              activeElement?.closest('.datepicker-header') ||
                              activeElement?.closest('.datepicker-footer');
      
      if (!isInsideCalendar) {
        this.showCalendar = false;
        this.control?.markAsTouched();
      }
    }, 150);
    
    
    const currentValue = this.control.value;
    if (currentValue && typeof currentValue === 'string' && currentValue.length === 10) {
      
      this.control.setValue(currentValue);
    } else if (!currentValue || currentValue === '') {
      
      this.control.setValue('');
    }
  }

  previousMonth(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  previousYear(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.currentViewMode === 'years') {
      this.previousDecade();
    } else {
      this.currentDate = new Date(this.currentDate.getFullYear() - 1, this.currentDate.getMonth(), 1);
      if (this.currentViewMode === 'days') {
        this.generateCalendar();
      } else if (this.currentViewMode === 'months') {
        this.generateMonthsGrid();
      }
    }
  }

  nextYear(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.currentViewMode === 'years') {
      this.nextDecade();
    } else {
      this.currentDate = new Date(this.currentDate.getFullYear() + 1, this.currentDate.getMonth(), 1);
      if (this.currentViewMode === 'days') {
        this.generateCalendar();
      } else if (this.currentViewMode === 'months') {
        this.generateMonthsGrid();
      }
    }
  }

  previousDecade(): void {
    this.currentDecade.start -= 12;
    this.currentDecade.end -= 12;
    this.generateYearsGrid();
  }

  nextDecade(): void {
    this.currentDecade.start += 12;
    this.currentDecade.end += 12;
    this.generateYearsGrid();
  }

  selectDate(day: CalendarDay): void {
    if (day.isDisabled) return;
    
    
    const formattedDate = day.date.toLocaleDateString('pt-BR');
    this.control?.setValue(formattedDate);
    this.control?.markAsTouched();
    this.showCalendar = false;
  }

  selectMonth(month: CalendarMonth): void {
    if (!month.isDisabled) {
      this.currentDate = new Date(this.currentDate.getFullYear(), month.month, 1);
      this.switchToDayView();
    }
  }

  selectYear(year: CalendarYear): void {
    if (!year.isDisabled) {
      this.currentDate = new Date(year.year, this.currentDate.getMonth(), 1);
      this.switchToMonthView();
    }
  }

  selectToday(): void {
    const today = new Date();
    
    const formattedDate = today.toLocaleDateString('pt-BR');
    this.control?.setValue(formattedDate);
    this.control?.markAsTouched();
    this.showCalendar = false;
  }

  clearDate(): void {
    this.control?.setValue('');
    this.control?.markAsTouched();
    this.showCalendar = false;
  }

  private generateMonthsGrid(): void {
    const selectedDate = this.getSelectedDate();
    const currentYear = this.currentDate.getFullYear();
    const monthNames = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    this.calendarMonths = monthNames.map((name, index) => ({
      month: index,
      name,
      isSelected: selectedDate ? 
        selectedDate.getFullYear() === currentYear && selectedDate.getMonth() === index : false,
      isDisabled: this.isMonthDisabled(currentYear, index)
    }));
  }

  private generateYearsGrid(): void {
    const selectedDate = this.getSelectedDate();
    const currentYear = this.currentDate.getFullYear();
    
    
    if (this.currentDecade.start === 0) {
      const decadeStart = Math.floor(currentYear / 12) * 12;
      this.currentDecade = {
        start: decadeStart,
        end: decadeStart + 11
      };
    }

    this.calendarYears = [];
    for (let year = this.currentDecade.start; year <= this.currentDecade.end; year++) {
      this.calendarYears.push({
        year,
        isSelected: selectedDate ? selectedDate.getFullYear() === year : false,
        isDisabled: this.isYearDisabled(year)
      });
    }
  }

  private generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const today = new Date();
    const selectedDate = this.getSelectedDate();
    
    
    const firstDay = new Date(year, month, 1);
    
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    
    this.calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = this.isSameDay(date, today);
      const isSelected = selectedDate && this.isSameDay(date, selectedDate);
      const isDisabled = this.isDateDisabled(date);
      
      this.calendarDays.push({
        day: date.getDate(),
        date: new Date(date),
        isCurrentMonth,
        isSelected: !!isSelected,
        isToday,
        isDisabled
      });
    }
  }

  private getSelectedDate(): Date | null {
    if (!this.control?.value) return null;
    
    const date = this.control.value instanceof Date 
      ? this.control.value 
      : new Date(this.control.value);
    
    return isNaN(date.getTime()) ? null : date;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private isDateDisabled(date: Date): boolean {
    if (this.minDate) {
      const minDateOnly = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate());
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (dateOnly < minDateOnly) return true;
    }
    if (this.maxDate) {
      const maxDateOnly = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate());
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (dateOnly > maxDateOnly) return true;
    }
    return false;
  }

  private isMonthDisabled(year: number, month: number): boolean {
    if (this.minDate) {
      const minYear = this.minDate.getFullYear();
      const minMonth = this.minDate.getMonth();
      if (year < minYear || (year === minYear && month < minMonth)) {
        return true;
      }
    }
    if (this.maxDate) {
      const maxYear = this.maxDate.getFullYear();
      const maxMonth = this.maxDate.getMonth();
      if (year > maxYear || (year === maxYear && month > maxMonth)) {
        return true;
      }
    }
    return false;
  }

  private isYearDisabled(year: number): boolean {
    if (this.minDate && year < this.minDate.getFullYear()) {
      return true;
    }
    if (this.maxDate && year > this.maxDate.getFullYear()) {
      return true;
    }
    return false;
  }

  private applyDateMask(value: string): string {
     
     const numbers = value.replace(/\D/g, '');
     
     
     let masked = '';
     for (let i = 0; i < numbers.length && i < 8; i++) {
       if (i === 2 || i === 4) {
         masked += '/';
       }
       masked += numbers[i];
     }
     
     return masked;
   }

   private parseDate(value: string): Date | null {
     
     const parts = value.split('/');
     
     if (parts.length === 3) {
       const day = parseInt(parts[0], 10);
       const month = parseInt(parts[1], 10) - 1; 
       const year = parseInt(parts[2], 10);
       
       const date = new Date(year, month, day);
       
       
       if (date.getFullYear() === year && 
           date.getMonth() === month && 
           date.getDate() === day) {
         return date;
       }
     }
     
     return null;
   }

  private calculateDropdownPosition(): void {
    if (!this.datepickerContainer || !this.dropdownElement) {
      return;
    }

    const containerRect = this.datepickerContainer.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    
    const spaceBelow = viewportHeight - containerRect.bottom;
    const spaceAbove = containerRect.top;
    const dropdownHeight = 320; 
    
    this.dropdownPosition.up = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
    
    
    const spaceRight = viewportWidth - containerRect.left;
    const dropdownWidth = 320; 
    
    this.dropdownPosition.right = spaceRight < dropdownWidth;
  }

  onKeyDown(event: KeyboardEvent, action: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      switch (action) {
        case 'toggleCalendar':
          this.toggleCalendar();
          break;
        case 'switchToMonthView':
          if (this.currentViewMode === 'days') {
            this.switchToMonthView(event);
          }
          break;
        case 'switchToYearView':
          if (this.currentViewMode !== 'years') {
            this.switchToYearView(event);
          }
          break;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    
    if (target.classList.contains('month') || 
        target.classList.contains('year') ||
        target.closest('.datepicker-months') ||
        target.closest('.datepicker-years') ||
        target.closest('.datepicker-days') ||
        target.closest('.datepicker-nav') ||
        target.closest('.datepicker-header') ||
        target.closest('.datepicker-footer')) {
      return;
    }
    
    if (!target.closest('.input-group.date') && !target.closest('.datepicker-dropdown')) {
      this.showCalendar = false;
    }
  }
}