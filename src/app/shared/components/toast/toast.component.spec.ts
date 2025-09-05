import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ToastComponent } from './toast.component';
import { ToastService, ToastType } from './toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display toasts from service', () => {
    toastService.show('Test message', 'info');
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('.toast-item'));
    expect(toastElements.length).toBe(1);
    expect(toastElements[0].nativeElement.textContent).toContain('Test message');
  });

  it('should display multiple toasts', () => {
    toastService.show('Message 1', 'info');
    toastService.show('Message 2', 'success');
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('.toast-item'));
    expect(toastElements.length).toBe(2);
  });

  it('should remove toast when close button is clicked', () => {
    const _id = toastService.show('Test message', 'info');
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('.btn-close'));
    closeButton.nativeElement.click();
    fixture.detectChanges();

    const toastElements = fixture.debugElement.queryAll(By.css('.toast-item'));
    expect(toastElements.length).toBe(0);
  });

  describe('getToastClasses', () => {
    it('should return correct classes for success type', () => {
      const classes = component.getToastClasses('success');
      expect(classes).toContain('bg-success-subtle');
      expect(classes).toContain('border-success');
      expect(classes).toContain('text-success-emphasis');
    });

    it('should return correct classes for danger type', () => {
      const classes = component.getToastClasses('danger');
      expect(classes).toContain('bg-danger-subtle');
      expect(classes).toContain('border-danger');
      expect(classes).toContain('text-danger-emphasis');
    });

    it('should return correct classes for warning type', () => {
      const classes = component.getToastClasses('warning');
      expect(classes).toContain('bg-warning-subtle');
      expect(classes).toContain('border-warning');
      expect(classes).toContain('text-warning-emphasis');
    });

    it('should return correct classes for info type', () => {
      const classes = component.getToastClasses('info');
      expect(classes).toContain('bg-info-subtle');
      expect(classes).toContain('border-info');
      expect(classes).toContain('text-info-emphasis');
    });

    it('should return info classes for unknown type', () => {
      const classes = component.getToastClasses('unknown' as ToastType);
      expect(classes).toContain('bg-info-subtle');
      expect(classes).toContain('border-info');
      expect(classes).toContain('text-info-emphasis');
    });
  });

  describe('getIconClass', () => {
    it('should return correct icon for success type', () => {
      const iconClass = component.getIconClass('success');
      expect(iconClass).toBe('check_circle');
    });

    it('should return correct icon for danger type', () => {
      const iconClass = component.getIconClass('danger');
      expect(iconClass).toBe('error');
    });

    it('should return correct icon for warning type', () => {
      const iconClass = component.getIconClass('warning');
      expect(iconClass).toBe('warning');
    });

    it('should return correct icon for info type', () => {
      const iconClass = component.getIconClass('info');
      expect(iconClass).toBe('info');
    });

    it('should return info icon for unknown type', () => {
      const iconClass = component.getIconClass('unknown' as ToastType);
      expect(iconClass).toBe('info');
    });
  });

  describe('visual elements', () => {
    it('should display correct icon for each toast type', () => {
      toastService.show('Success message', 'success');
      toastService.show('Danger message', 'danger');
      toastService.show('Warning message', 'warning');
      toastService.show('Info message', 'info');
      fixture.detectChanges();

      const icons = fixture.debugElement.queryAll(By.css('mat-icon'));
      expect(icons[0].nativeElement.textContent?.trim()).toBe('check_circle');
    expect(icons[1].nativeElement.textContent?.trim()).toBe('error');
    expect(icons[2].nativeElement.textContent?.trim()).toBe('warning');
    expect(icons[3].nativeElement.textContent?.trim()).toBe('info');
    });

    it('should have proper accessibility attributes', () => {
      toastService.show('Test message', 'info');
      fixture.detectChanges();

      const toastElement = fixture.debugElement.query(By.css('.toast-item'));
      const closeButton = fixture.debugElement.query(By.css('.btn-close'));

      expect(toastElement.nativeElement.getAttribute('role')).toBe('alert');
      expect(closeButton.nativeElement.getAttribute('aria-label')).toBe('Fechar toast');
    });

    it('should apply correct CSS classes based on toast type', () => {
      toastService.show('Success message', 'success');
      fixture.detectChanges();

      const toastElement = fixture.debugElement.query(By.css('.toast-item'));
      expect(toastElement.nativeElement.className).toContain('bg-success-subtle');
      expect(toastElement.nativeElement.className).toContain('border-success');
    });
  });
});