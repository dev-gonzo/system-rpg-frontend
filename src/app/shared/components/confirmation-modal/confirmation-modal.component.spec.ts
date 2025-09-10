import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ConfirmationModalService } from './confirmation-modal.service';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let confirmationModalService: ConfirmationModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    confirmationModalService = TestBed.inject(ConfirmationModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display modal when no modal is active', () => {
    const modalElement = fixture.debugElement.query(By.css('.modal-backdrop'));
    expect(modalElement).toBeNull();
  });

  it('should display modal when modal is active', () => {
    confirmationModalService.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: jasmine.createSpy('onConfirm')
    });
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal-backdrop'));
    expect(modalElement).toBeTruthy();
    
    const titleElement = fixture.debugElement.query(By.css('.modal-title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');
    
    const messageElement = fixture.debugElement.query(By.css('.modal-body p'));
    expect(messageElement.nativeElement.textContent.trim()).toBe('Test Message');
  });

  it('should call confirm when confirm button is clicked', () => {
    const onConfirmSpy = jasmine.createSpy('onConfirm');
    confirmationModalService.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: onConfirmSpy
    });
    fixture.detectChanges();

    const confirmButton = fixture.debugElement.query(By.css('.btn-success'));
    confirmButton.nativeElement.click();

    expect(onConfirmSpy).toHaveBeenCalled();
  });

  it('should call cancel when cancel button is clicked', () => {
    const onCancelSpy = jasmine.createSpy('onCancel');
    confirmationModalService.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: jasmine.createSpy('onConfirm'),
      onCancel: onCancelSpy
    });
    fixture.detectChanges();

    const cancelButton = fixture.debugElement.query(By.css('.btn-secondary'));
    cancelButton.nativeElement.click();

    expect(onCancelSpy).toHaveBeenCalled();
  });

  it('should hide modal when backdrop is clicked', () => {
    confirmationModalService.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: jasmine.createSpy('onConfirm')
    });
    fixture.detectChanges();

    const backdrop = fixture.debugElement.query(By.css('.modal-backdrop'));
    backdrop.nativeElement.click();
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal-backdrop'));
    expect(modalElement).toBeNull();
  });

  it('should hide modal when escape key is pressed', () => {
    confirmationModalService.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: jasmine.createSpy('onConfirm')
    });
    fixture.detectChanges();

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(By.css('.modal-backdrop'));
    expect(modalElement).toBeNull();
  });

  it('should apply correct button classes', () => {
    confirmationModalService.show({
      title: 'Test Title',
      message: 'Test Message',
      confirmButtonClass: 'btn-danger',
      cancelButtonClass: 'btn-warning',
      onConfirm: jasmine.createSpy('onConfirm')
    });
    fixture.detectChanges();

    const confirmButton = fixture.debugElement.query(By.css('.btn-danger'));
    const cancelButton = fixture.debugElement.query(By.css('.btn-warning'));
    
    expect(confirmButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
  });
});