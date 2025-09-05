import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import * as yup from 'yup';
import { FormValidatorService } from './form-validator.service';

describe('FormValidatorService', () => {
  let service: FormValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateForm', () => {
    let form: FormGroup;
    let schema: yup.ObjectSchema<{ name: string; email: string; age: number | undefined }>;

    beforeEach(() => {
      form = new FormGroup({
        name: new FormControl(''),
        email: new FormControl(''),
        age: new FormControl(null)
      });

      schema = yup.object({
        name: yup.string().required('Nome é obrigatório'),
        email: yup.string().email('Email inválido').required('Email é obrigatório'),
        age: yup.number().min(18, 'Idade mínima é 18 anos').optional()
      });
    });

    it('should return success true when form is valid', async () => {
      form.patchValue({
        name: 'João Silva',
        email: 'joao@example.com',
        age: 25
      });

      const result = await service.validateForm(form, schema);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        name: 'João Silva',
        email: 'joao@example.com',
        age: 25
      });
      expect(result.errors).toBeUndefined();
    });

    it('should return success false and errors when form is invalid', async () => {
      form.patchValue({
        name: '',
        email: 'invalid-email',
        age: 15
      });

      const result = await service.validateForm(form, schema);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.errors).toEqual({
        name: 'Nome é obrigatório',
        email: 'Email inválido',
        age: 'Idade mínima é 18 anos'
      });
    });

    it('should set form control errors when validation fails', async () => {
      form.patchValue({
        name: '',
        email: 'invalid-email'
      });

      await service.validateForm(form, schema);

      expect(form.get('name')?.errors).toEqual({ message: 'Nome é obrigatório' });
      expect(form.get('email')?.errors).toEqual({ message: 'Email inválido' });
      expect(form.get('name')?.touched).toBe(true);
      expect(form.get('name')?.dirty).toBe(true);
    });



    it('should only set message error when no custom errors exist', async () => {
      const nameControl = form.get('name')!;
      nameControl.setErrors({ message: 'Old message' });

      form.patchValue({ name: '' });

      await service.validateForm(form, schema);

      expect(nameControl.errors).toEqual({ message: 'Nome é obrigatório' });
    });

    it('should clear form errors when validation succeeds', async () => {
      
      form.get('name')?.setErrors({ message: 'Some error' });
      form.get('email')?.setErrors({ message: 'Some error' });

      
      form.patchValue({
        name: 'João Silva',
        email: 'joao@example.com',
        age: 25
      });

      await service.validateForm(form, schema);

      expect(form.get('name')?.errors).toBeNull();
      expect(form.get('email')?.errors).toBeNull();
    });

    it('should handle schema validation with stripUnknown option', async () => {
      const formWithExtra = new FormGroup({
        name: new FormControl('João Silva'),
        email: new FormControl('joao@example.com'),
        extraField: new FormControl('should be stripped')
      });

      const result = await service.validateForm(formWithExtra, schema);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        name: 'João Silva',
        email: 'joao@example.com'
      });
      expect((result.data as Record<string, unknown>)?.['extraField']).toBeUndefined();
    });

    it('should handle empty form data', async () => {
      const emptyForm = new FormGroup({});
      const emptySchema = yup.object({});

      const result = await service.validateForm(emptyForm, emptySchema);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });
  });

  describe('clearFormErrors', () => {
    let form: FormGroup;

    beforeEach(() => {
      form = new FormGroup({
        name: new FormControl(''),
        email: new FormControl('')
      });
    });

    it('should clear message errors from form controls', () => {
      const nameControl = form.get('name')!;
      const emailControl = form.get('email')!;

      nameControl.setErrors({ message: 'Name error' });
      emailControl.setErrors({ message: 'Email error' });

      
      (service as unknown as { clearFormErrors: (form: FormGroup) => void }).clearFormErrors(form);

      expect(nameControl.errors).toBeNull();
      expect(emailControl.errors).toBeNull();
    });

    it('should preserve non-message errors when clearing', () => {
      const nameControl = form.get('name')!;
      nameControl.setErrors({
        message: 'Name error',
        required: true,
        customError: 'Custom error'
      });

      (service as unknown as { clearFormErrors: (form: FormGroup) => void }).clearFormErrors(form);

      expect(nameControl.errors).toEqual({
        required: true,
        customError: 'Custom error'
      });
    });

    it('should handle controls without errors', () => {
      const nameControl = form.get('name')!;
      expect(nameControl.errors).toBeNull();

      expect(() => {
        (service as unknown as { clearFormErrors: (form: FormGroup) => void }).clearFormErrors(form);
      }).not.toThrow();

      expect(nameControl.errors).toBeNull();
    });

    it('should handle controls with only message errors', () => {
      const nameControl = form.get('name')!;
      nameControl.setErrors({ message: 'Only message error' });

      (service as unknown as { clearFormErrors: (form: FormGroup) => void }).clearFormErrors(form);

      expect(nameControl.errors).toBeNull();
    });
  });

  describe('mapYupErrors', () => {
    it('should map yup validation errors correctly', () => {
      const yupError = new yup.ValidationError(
        'Validation failed',
        undefined,
        'root'
      );
      
      yupError.inner = [
        new yup.ValidationError('Name is required', 'name', 'name'),
        new yup.ValidationError('Email is invalid', 'email', 'email'),
        new yup.ValidationError('Age must be positive', 'age', 'age')
      ];

      const result = (service as unknown as { mapYupErrors: (error: unknown) => Record<string, string> }).mapYupErrors(yupError);

      expect(result).toEqual({
        name: 'Name is required',
        email: 'Email is invalid',
        age: 'Age must be positive'
      });
    });

    it('should handle yup errors without path', () => {
      const yupError = new yup.ValidationError(
        'Validation failed',
        undefined,
        'root'
      );
      
      yupError.inner = [
        new yup.ValidationError('Error without path', undefined, undefined)
      ];

      const result = (service as unknown as { mapYupErrors: (error: unknown) => Record<string, string> }).mapYupErrors(yupError);

      expect(result).toEqual({});
    });

    it('should handle duplicate path errors (first one wins)', () => {
      const yupError = new yup.ValidationError(
        'Validation failed',
        undefined,
        'root'
      );
      
      yupError.inner = [
        new yup.ValidationError('First error', 'name', 'name'),
        new yup.ValidationError('Second error', 'name', 'name')
      ];

      const result = (service as unknown as { mapYupErrors: (error: unknown) => Record<string, string> }).mapYupErrors(yupError);

      expect(result).toEqual({
        name: 'First error'
      });
    });

    it('should return empty object for non-yup errors', () => {
      const regularError = new Error('Regular error');
      const result = (service as unknown as { mapYupErrors: (error: unknown) => Record<string, string> }).mapYupErrors(regularError);

      expect(result).toEqual({});
    });

    it('should return empty object for null/undefined errors', () => {
      expect((service as unknown as { mapYupErrors: (error: unknown) => Record<string, string> }).mapYupErrors(null)).toEqual({});
      expect((service as unknown as { mapYupErrors: (error: unknown) => Record<string, string> }).mapYupErrors(undefined)).toEqual({});
    });

    it('should handle empty yup error inner array', () => {
      const yupError = new yup.ValidationError(
        'Validation failed',
        undefined,
        'root'
      );
      
      yupError.inner = [];

      const result = (service as unknown as { mapYupErrors: (error: unknown) => Record<string, string> }).mapYupErrors(yupError);

      expect(result).toEqual({});
    });
  });
});