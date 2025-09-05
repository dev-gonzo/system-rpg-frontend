import { of, throwError } from 'rxjs';
import { createEmailAvailabilityValidator } from './check-email.validator';
import { RegisterApiService } from '@app/api/users/register.api.service';

describe('createEmailAvailabilityValidator', () => {
  let registerApiServiceSpy: jasmine.SpyObj<RegisterApiService>;
  let validator: (email: string) => Promise<{ isValid: boolean; message?: string }>;

  beforeEach(() => {
    registerApiServiceSpy = jasmine.createSpyObj('RegisterApiService', ['checkEmail']);
    validator = createEmailAvailabilityValidator(registerApiServiceSpy);
  });

  describe('empty or whitespace email', () => {
    it('should return valid for empty email', async () => {
      const result = await validator('');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });

    it('should return valid for null email', async () => {
      const result = await validator(null as unknown as string);
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });

    it('should return valid for undefined email', async () => {
      const result = await validator(undefined as unknown as string);
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });

    it('should return valid for whitespace-only email', async () => {
      const result = await validator('   ');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });
  });

  describe('invalid email format', () => {
    it('should return valid for email without @ symbol', async () => {
      const result = await validator('invalidemail.com');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });

    it('should return valid for email without domain', async () => {
      const result = await validator('user@');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });

    it('should return valid for email without TLD', async () => {
      const result = await validator('user@domain');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });

    it('should return valid for email with spaces', async () => {
      const result = await validator('user @domain.com');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });

    it('should return valid for email starting with @', async () => {
      const result = await validator('@domain.com');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).not.toHaveBeenCalled();
    });
  });

  describe('valid email format - API responses', () => {
    const validEmail = 'user@example.com';

    it('should return valid when email is available', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Email is available',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).toHaveBeenCalledWith(validEmail);
    });

    it('should return invalid when email is not available', async () => {
      const mockResponse = {
        data: { available: false },
        message: 'Email already exists',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({
        isValid: false,
        message: 'Email already exists'
      });
      expect(registerApiServiceSpy.checkEmail).toHaveBeenCalledWith(validEmail);
    });

    it('should return invalid with default message when email is not available and no message provided', async () => {
      const mockResponse = {
        data: { available: false },
        message: '',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({
        isValid: false,
        message: 'Email não está disponível'
      });
    });

    it('should return valid when API response is null', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Email is available',
        timestamp: Date.now(),
        _links: []
      };
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API response is undefined', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Email is available',
        timestamp: Date.now(),
        _links: []
      };
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({ isValid: true });
    });
  });

  describe('API error handling', () => {
    const validEmail = 'user@example.com';

    it('should return invalid with error message when API returns error with message', async () => {
      const errorResponse = {
        error: {
          message: 'Server error occurred'
        }
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(throwError(errorResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({
        isValid: false,
        message: 'Server error occurred'
      });
    });

    it('should return valid when API throws error without error.message', async () => {
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error'
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(throwError(errorResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws error with null error object', async () => {
      const errorResponse = {
        error: null
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(throwError(errorResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws error with undefined error object', async () => {
      const errorResponse = {
        error: undefined
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(throwError(errorResponse));

      const result = await validator(validEmail);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws simple error', async () => {
      registerApiServiceSpy.checkEmail.and.returnValue(throwError('Simple error'));

      const result = await validator(validEmail);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws network error', async () => {
      const networkError = new Error('Network error');
      registerApiServiceSpy.checkEmail.and.returnValue(throwError(networkError));

      const result = await validator(validEmail);

      expect(result).toEqual({ isValid: true });
    });
  });

  describe('edge cases', () => {
    it('should handle complex valid email formats', async () => {
      const complexEmails = [
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@sub.domain.org',
        'a@b.co'
      ];

      const mockResponse = {
        data: { available: true },
        message: 'Email is available',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      for (const email of complexEmails) {
        const result = await validator(email);
        expect(result).toEqual({ isValid: true });
        expect(registerApiServiceSpy.checkEmail).toHaveBeenCalledWith(email);
      }
    });

    it('should handle email with mixed case', async () => {
      const email = 'User.Name@Example.COM';
      const mockResponse = {
        data: { available: true },
        message: 'Email is available',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      const result = await validator(email);

      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkEmail).toHaveBeenCalledWith(email);
    });

    it('should handle response with missing data property', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Some message',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      const result = await validator('user@example.com');

      expect(result).toEqual({ isValid: true });
    });

    it('should handle response with null data property', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Some message',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkEmail.and.returnValue(of(mockResponse));

      const result = await validator('user@example.com');

      expect(result).toEqual({ isValid: true });
    });
  });
});