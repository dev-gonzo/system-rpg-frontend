import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { WrapperComponent } from './wrapper.component';

@Component({
  standalone: true,
  imports: [WrapperComponent],
  template: `
    <app-form-wrapper 
      [label]="label" 
      [error]="error" 
      [helper]="helper" 
      [inputId]="inputId">
      <input type="text" class="form-control">
    </app-form-wrapper>
  `
})
class TestHostComponent {
  label = '';
  error: string | null = null;
  helper = '';
  inputId = '';
}

describe('WrapperComponent', () => {
  let component: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.componentInstance;
    
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.label).toBe('');
    expect(component.error).toBe('');
    expect(component.helper).toBe('');
    expect(component.inputId).toBe('');
  });

  it('should render label', () => {
    hostComponent.label = 'Test Label';
    hostFixture.detectChanges();
    
    const labelElement = hostFixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.textContent.trim()).toBe('Test Label');
  });

  it('should set for attribute on label', () => {
    hostComponent.inputId = 'test-input';
    hostFixture.detectChanges();
    
    const labelElement = hostFixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.getAttribute('for')).toBe('test-input');
  });

  it('should render helper text when provided', () => {
    hostComponent.helper = 'Helper text';
    hostFixture.detectChanges();
    
    const helperElement = hostFixture.debugElement.query(By.css('.text-muted'));
    expect(helperElement.nativeElement.textContent.trim()).toBe('Helper text');
  });

  it('should not render helper text when empty', () => {
    hostComponent.helper = '';
    hostFixture.detectChanges();
    
    const helperElement = hostFixture.debugElement.query(By.css('.text-muted'));
    expect(helperElement).toBeFalsy();
  });

  it('should render error message when provided', () => {
    hostComponent.error = 'Error message';
    hostFixture.detectChanges();
    
    const errorElement = hostFixture.debugElement.query(By.css('.invalid-feedback'));
    expect(errorElement.nativeElement.textContent.trim()).toBe('Error message');
  });

  it('should not render error message when empty', () => {
    hostComponent.error = '';
    hostFixture.detectChanges();
    
    const errorElement = hostFixture.debugElement.query(By.css('.invalid-feedback'));
    expect(errorElement).toBeFalsy();
  });

  it('should apply text-danger class when error exists', () => {
    hostComponent.error = 'Error';
    hostFixture.detectChanges();
    
    const labelElement = hostFixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.classList.contains('text-danger')).toBeTruthy();
  });

  it('should not apply text-danger class when no error', () => {
    hostComponent.error = '';
    hostFixture.detectChanges();
    
    const labelElement = hostFixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.classList.contains('text-danger')).toBeFalsy();
  });

  it('should generate hostClass with col property', () => {
    component.col = 6;
    expect(component.hostClass).toBe('col-6');
  });

  it('should generate hostClass with colMd property', () => {
    component.colMd = 8;
    expect(component.hostClass).toBe('col-md-8');
  });

  it('should generate hostClass with colLg property', () => {
    component.colLg = 10;
    expect(component.hostClass).toBe('col-lg-10');
  });

  it('should generate hostClass with colXl property', () => {
    component.colXl = 12;
    expect(component.hostClass).toBe('col-xl-12');
  });

  it('should generate hostClass with multiple column properties', () => {
    component.col = 12;
    component.colMd = 6;
    component.colLg = 4;
    component.colXl = 3;
    expect(component.hostClass).toBe('col-12 col-md-6 col-lg-4 col-xl-3');
  });

  it('should return empty hostClass when no column properties are set', () => {
     expect(component.hostClass).toBe('');
   });
});