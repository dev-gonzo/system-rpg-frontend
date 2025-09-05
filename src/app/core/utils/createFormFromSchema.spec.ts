import * as yup from 'yup';
import { createFormFromSchema } from './createFormFromSchema';

describe('createFormFromSchema', () => {
  let onValidSpy: jasmine.Spy;

  beforeEach(() => {
    onValidSpy = jasmine.createSpy('onValid');
  });

  describe('form creation with different field types', () => {
    it('should create form with string fields', () => {
      const schema = yup.object({
        name: yup.string().required(),
        email: yup.string().email()
      });

      const handler = createFormFromSchema(schema, onValidSpy);

      expect(handler.form).toBeDefined();
      expect(handler.submit).toBeDefined();
      expect(handler.form.get('name')?.value).toBe('');
      expect(handler.form.get('email')?.value).toBe('');
    });

    it('should create form with number fields', () => {
      const schema = yup.object({
        age: yup.number().required(),
        score: yup.number().min(0).max(100)
      });

      const handler = createFormFromSchema(schema, onValidSpy);

      expect(handler.form.get('age')?.value).toBeNull();
      expect(handler.form.get('score')?.value).toBeNull();
    });

    it('should create form with boolean fields', () => {
      const schema = yup.object({
        isActive: yup.boolean().required(),
        hasPermission: yup.boolean()
      });

      const handler = createFormFromSchema(schema, onValidSpy);

      expect(handler.form.get('isActive')?.value).toBeNull();
      expect(handler.form.get('hasPermission')?.value).toBeNull();
    });

    it('should create form with array fields', () => {
      const schema = yup.object({
        tags: yup.array().of(yup.string()),
        numbers: yup.array().of(yup.number())
      });

      const handler = createFormFromSchema(schema, onValidSpy);

      expect(handler.form.get('tags')?.value).toEqual([]);
      expect(handler.form.get('numbers')?.value).toEqual([]);
    });

    it('should create form with object fields', () => {
      const schema = yup.object({
        address: yup.object({
          street: yup.string(),
          city: yup.string()
        }),
        metadata: yup.object()
      });

      const handler = createFormFromSchema(schema, onValidSpy);

      expect(handler.form.get('address')?.value).toBeNull();
      expect(handler.form.get('metadata')?.value).toBeNull();
    });

    it('should create form with mixed field types', () => {
      const schema = yup.object({
        name: yup.string().required(),
        age: yup.number().required(),
        isActive: yup.boolean(),
        tags: yup.array().of(yup.string()),
        profile: yup.object({
          bio: yup.string()
        })
      });

      const handler = createFormFromSchema(schema, onValidSpy);

      expect(handler.form.get('name')?.value).toBe('');
      expect(handler.form.get('age')?.value).toBeNull();
      expect(handler.form.get('isActive')?.value).toBeNull();
      expect(handler.form.get('tags')?.value).toEqual([]);
      expect(handler.form.get('profile')?.value).toBeNull();
    });
  });

  describe('initial values', () => {
    it('should use initial values when provided', () => {
      const schema = yup.object({
        name: yup.string().required(),
        age: yup.number().required(),
        isActive: yup.boolean(),
        tags: yup.array().of(yup.string())
      });

      const initialValues = {
        name: 'John Doe',
        age: 30,
        isActive: true,
        tags: ['developer', 'angular']
      };

      const handler = createFormFromSchema(schema, onValidSpy, initialValues);

      expect(handler.form.get('name')?.value).toBe('John Doe');
      expect(handler.form.get('age')?.value).toBe(30);
      expect(handler.form.get('isActive')?.value).toBe(true);
      expect(handler.form.get('tags')?.value).toEqual(['developer', 'angular']);
    });

    it('should use partial initial values', () => {
      const schema = yup.object({
        name: yup.string().required(),
        age: yup.number().required(),
        email: yup.string().email()
      });

      const initialValues = {
        name: 'Jane Doe'
      };

      const handler = createFormFromSchema(schema, onValidSpy, initialValues);

      expect(handler.form.get('name')?.value).toBe('Jane Doe');
      expect(handler.form.get('age')?.value).toBeNull();
      expect(handler.form.get('email')?.value).toBe('');
    });

    it('should handle undefined initial values', () => {
      const schema = yup.object({
        name: yup.string().required(),
        age: yup.number()
      });

      const handler = createFormFromSchema(schema, onValidSpy, undefined);

      expect(handler.form.get('name')?.value).toBe('');
      expect(handler.form.get('age')?.value).toBeNull();
    });

    it('should handle null initial values', () => {
      const schema = yup.object({
        name: yup.string().required(),
        age: yup.number()
      });

      const handler = createFormFromSchema(schema, onValidSpy, undefined);

      expect(handler.form.get('name')?.value).toBe('');
      expect(handler.form.get('age')?.value).toBeNull();
    });

    it('should prioritize user values over default values', () => {
      const schema = yup.object({
        name: yup.string().default('Default Name'),
        age: yup.number().default(25)
      });

      const initialValues = {
        name: 'User Name',
        age: 35
      };

      const handler = createFormFromSchema(schema, onValidSpy, initialValues);

      expect(handler.form.get('name')?.value).toBe('User Name');
      expect(handler.form.get('age')?.value).toBe(35);
    });
  });

  describe('submit function', () => {
    it('should call onValid with parsed data when validation succeeds', async () => {
      const schema = yup.object({
        name: yup.string().required(),
        age: yup.number().required().min(18)
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      handler.form.patchValue({
        name: 'John Doe',
        age: 25
      });

      const result = await handler.submit();

      expect(onValidSpy).toHaveBeenCalledWith({
        name: 'John Doe',
        age: 25
      });
      expect(result).toEqual({
        name: 'John Doe',
        age: 25
      });
    });

    it('should return undefined when validation fails', async () => {
      const schema = yup.object({
        name: yup.string().required('Name is required'),
        age: yup.number().required('Age is required').min(18, 'Must be at least 18')
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      handler.form.patchValue({
        name: '',
        age: 15
      });

      const result = await handler.submit();

      expect(onValidSpy).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should set form errors when validation fails', async () => {
      const schema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email format').required('Email is required')
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      handler.form.patchValue({
        name: '',
        email: 'invalid-email'
      });

      await handler.submit();

      expect(handler.form.get('name')?.errors).toEqual({ message: 'Name is required' });
      expect(handler.form.get('email')?.errors).toEqual({ message: 'Invalid email format' });
    });

    it('should mark all fields as touched when submitting', async () => {
      const schema = yup.object({
        name: yup.string().required(),
        email: yup.string().required()
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      expect(handler.form.get('name')?.touched).toBeFalsy();
      expect(handler.form.get('email')?.touched).toBeFalsy();

      await handler.submit();

      expect(handler.form.get('name')?.touched).toBeTruthy();
      expect(handler.form.get('email')?.touched).toBeTruthy();
    });

    it('should handle validation errors without path', async () => {
      const schema = yup.object({
        name: yup.string().required('Name is required')
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      
      spyOn(schema, 'validate').and.returnValue(Promise.reject({
        inner: [{ message: 'General error' }] 
      }));

      const result = await handler.submit();

      expect(result).toBeUndefined();
      expect(onValidSpy).not.toHaveBeenCalled();
    });

    it('should handle non-yup validation errors', async () => {
      const schema = yup.object({
        name: yup.string().required()
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      
      spyOn(schema, 'validate').and.returnValue(Promise.reject(new Error('Generic error')));

      const result = await handler.submit();

      expect(result).toBeUndefined();
      expect(onValidSpy).not.toHaveBeenCalled();
    });

    it('should handle complex nested validation', async () => {
      const schema = yup.object({
        user: yup.object({
          profile: yup.object({
            name: yup.string().required('Name is required'),
            age: yup.number().min(18, 'Must be 18 or older')
          })
        })
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      handler.form.patchValue({
        user: {
          profile: {
            name: 'John',
            age: 25
          }
        }
      });

      const result = await handler.submit();

      expect(onValidSpy).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle empty schema', () => {
      const schema = yup.object({});

      const handler = createFormFromSchema(schema, onValidSpy);

      expect(handler.form).toBeDefined();
      expect(Object.keys(handler.form.controls).length).toBe(0);
    });

    it('should handle schema with unknown field type', () => {
      const schema = yup.object({
        customField: yup.mixed() 
      });

      const handler = createFormFromSchema(schema, onValidSpy);

      
      expect(handler.form.get('customField')?.value).toBe('');
    });

    it('should handle multiple submit calls', async () => {
      const schema = yup.object({
        name: yup.string().required()
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      handler.form.patchValue({ name: 'Test' });

      const result1 = await handler.submit();
      const result2 = await handler.submit();

      expect(onValidSpy).toHaveBeenCalledTimes(2);
      expect(result1).toEqual({ name: 'Test' });
      expect(result2).toEqual({ name: 'Test' });
    });

    it('should handle form value changes after creation', async () => {
      const schema = yup.object({
        name: yup.string().required(),
        age: yup.number().required()
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      
      handler.form.get('name')?.setValue('Updated Name');
      handler.form.get('age')?.setValue(30);

      const result = await handler.submit();

      expect(result).toEqual({
        name: 'Updated Name',
        age: 30
      });
    });

    it('should preserve form state between submissions', async () => {
      const schema = yup.object({
        name: yup.string().required('Name is required')
      });

      const handler = createFormFromSchema(schema, onValidSpy);
      
      
      await handler.submit();
      expect(handler.form.get('name')?.errors).toEqual({ message: 'Name is required' });
      
      
      handler.form.patchValue({ name: 'Valid Name' });
      await handler.submit();
      
      expect(onValidSpy).toHaveBeenCalledWith({ name: 'Valid Name' });
    });
  });
});