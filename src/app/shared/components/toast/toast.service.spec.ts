import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService, ToastType } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should add toast to the list', () => {
      const message = 'Test message';
      const type: ToastType = 'info';
      
      const id = service.show(message, type);
      const toasts = service.getToasts();
      
      expect(toasts.length).toBe(1);
      expect(toasts[0].message).toBe(message);
      expect(toasts[0].type).toBe(type);
      expect(toasts[0].id).toBe(id);
    });

    it('should generate unique IDs for toasts', () => {
      const id1 = service.show('Message 1');
      const id2 = service.show('Message 2');
      
      expect(id1).not.toBe(id2);
    });

    it('should auto-close toast after 5 seconds when autoClose is true', fakeAsync(() => {
      const _id = service.show('Test message', 'info', true);
      
      expect(service.getToasts().length).toBe(1);
      
      tick(5000);
      
      expect(service.getToasts().length).toBe(0);
    }));

    it('should not auto-close toast when autoClose is false', fakeAsync(() => {
      const _id = service.show('Test message', 'info', false);
      
      expect(service.getToasts().length).toBe(1);
      
      tick(5000);
      
      expect(service.getToasts().length).toBe(1);
    }));
  });

  describe('remove', () => {
    it('should remove toast by ID', () => {
      const id1 = service.show('Message 1');
      const id2 = service.show('Message 2');
      
      expect(service.getToasts().length).toBe(2);
      
      service.remove(id1);
      
      const toasts = service.getToasts();
      expect(toasts.length).toBe(1);
      expect(toasts[0].id).toBe(id2);
    });

    it('should not affect other toasts when removing non-existent ID', () => {
      const _id = service.show('Message');
      
      service.remove('non-existent-id');
      
      expect(service.getToasts().length).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all toasts', () => {
      service.show('Message 1');
      service.show('Message 2');
      service.show('Message 3');
      
      expect(service.getToasts().length).toBe(3);
      
      service.clear();
      
      expect(service.getToasts().length).toBe(0);
    });
  });

  describe('convenience methods', () => {
    it('should create success toast', () => {
      const _id = service.success('Success message');
      const toasts = service.getToasts();
      
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].message).toBe('Success message');
    });

    it('should create danger toast', () => {
      const _id = service.danger('Danger message');
      const toasts = service.getToasts();
      
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('danger');
      expect(toasts[0].message).toBe('Danger message');
    });

    it('should create info toast', () => {
      const _id = service.info('Info message');
      const toasts = service.getToasts();
      
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].message).toBe('Info message');
    });

    it('should create warning toast', () => {
      const _id = service.warning('Warning message');
      const toasts = service.getToasts();
      
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('warning');
      expect(toasts[0].message).toBe('Warning message');
    });

    it('should respect autoClose parameter in convenience methods', fakeAsync(() => {
      service.success('Success message', false);
      
      tick(5000);
      
      expect(service.getToasts().length).toBe(1);
    }));
  });
});