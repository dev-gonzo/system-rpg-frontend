import { TestBed } from '@angular/core/testing';

import { ConfirmationModalService } from './confirmation-modal.service';

describe('ConfirmationModalService', () => {
  let service: ConfirmationModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have no modal', () => {
    expect(service.getModal()).toBeNull();
  });

  it('should show modal with correct configuration', () => {
    const config = {
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: jasmine.createSpy('onConfirm')
    };

    const id = service.show(config);
    const modal = service.getModal();

    expect(modal).toBeTruthy();
    expect(modal?.id).toBe(id);
    expect(modal?.title).toBe('Test Title');
    expect(modal?.message).toBe('Test Message');
    expect(modal?.confirmText).toBe('Confirmar');
    expect(modal?.cancelText).toBe('Cancelar');
    expect(modal?.confirmButtonClass).toBe('btn-success');
    expect(modal?.cancelButtonClass).toBe('btn-secondary');
  });

  it('should use custom button texts and classes', () => {
    const config = {
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Delete',
      cancelText: 'Keep',
      confirmButtonClass: 'btn-danger',
      cancelButtonClass: 'btn-outline-secondary',
      onConfirm: jasmine.createSpy('onConfirm')
    };

    service.show(config);
    const modal = service.getModal();

    expect(modal?.confirmText).toBe('Delete');
    expect(modal?.cancelText).toBe('Keep');
    expect(modal?.confirmButtonClass).toBe('btn-danger');
    expect(modal?.cancelButtonClass).toBe('btn-outline-secondary');
  });

  it('should hide modal', () => {
    service.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: jasmine.createSpy('onConfirm')
    });

    expect(service.getModal()).toBeTruthy();

    service.hide();

    expect(service.getModal()).toBeNull();
  });

  it('should call onConfirm and hide modal when confirm is called', () => {
    const onConfirmSpy = jasmine.createSpy('onConfirm');
    service.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: onConfirmSpy
    });

    service.confirm();

    expect(onConfirmSpy).toHaveBeenCalled();
    expect(service.getModal()).toBeNull();
  });

  it('should call onCancel and hide modal when cancel is called', () => {
    const onCancelSpy = jasmine.createSpy('onCancel');
    service.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: jasmine.createSpy('onConfirm'),
      onCancel: onCancelSpy
    });

    service.cancel();

    expect(onCancelSpy).toHaveBeenCalled();
    expect(service.getModal()).toBeNull();
  });

  it('should not call onCancel if not provided', () => {
    service.show({
      title: 'Test Title',
      message: 'Test Message',
      onConfirm: jasmine.createSpy('onConfirm')
    });

    expect(() => service.cancel()).not.toThrow();
    expect(service.getModal()).toBeNull();
  });

  it('should generate unique IDs', () => {
    const id1 = service.show({
      title: 'Test 1',
      message: 'Message 1',
      onConfirm: jasmine.createSpy('onConfirm')
    });
    service.hide();

    const id2 = service.show({
      title: 'Test 2',
      message: 'Message 2',
      onConfirm: jasmine.createSpy('onConfirm')
    });

    expect(id1).not.toBe(id2);
  });

  describe('convenience methods', () => {
    it('should create danger modal with correct defaults', () => {
      const onConfirmSpy = jasmine.createSpy('onConfirm');
      service.showDanger('Delete Item', 'Are you sure?', onConfirmSpy);
      
      const modal = service.getModal();
      expect(modal?.title).toBe('Delete Item');
      expect(modal?.message).toBe('Are you sure?');
      expect(modal?.confirmText).toBe('Excluir');
      expect(modal?.cancelText).toBe('Cancelar');
      expect(modal?.confirmButtonClass).toBe('btn-danger');
      expect(modal?.cancelButtonClass).toBe('btn-secondary');
    });

    it('should create warning modal with correct defaults', () => {
      const onConfirmSpy = jasmine.createSpy('onConfirm');
      service.showWarning('Warning', 'This action cannot be undone', onConfirmSpy);
      
      const modal = service.getModal();
      expect(modal?.title).toBe('Warning');
      expect(modal?.message).toBe('This action cannot be undone');
      expect(modal?.confirmText).toBe('Continuar');
      expect(modal?.cancelText).toBe('Cancelar');
      expect(modal?.confirmButtonClass).toBe('btn-warning');
      expect(modal?.cancelButtonClass).toBe('btn-secondary');
    });

    it('should create info modal with correct defaults', () => {
      const onConfirmSpy = jasmine.createSpy('onConfirm');
      service.showInfo('Information', 'Please confirm this action', onConfirmSpy);
      
      const modal = service.getModal();
      expect(modal?.title).toBe('Information');
      expect(modal?.message).toBe('Please confirm this action');
      expect(modal?.confirmText).toBe('OK');
      expect(modal?.cancelText).toBe('Cancelar');
      expect(modal?.confirmButtonClass).toBe('btn-primary');
      expect(modal?.cancelButtonClass).toBe('btn-secondary');
    });
  });
});