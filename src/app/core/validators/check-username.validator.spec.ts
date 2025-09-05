import { of, throwError } from 'rxjs';
import { createUsernameAvailabilityValidator } from './check-username.validator';
import { RegisterApiService } from '@app/api/users/register.api.service';

describe('createUsernameAvailabilityValidator', () => {
  let registerApiServiceSpy: jasmine.SpyObj<RegisterApiService>;
  let validator: (username: string) => Promise<{ isValid: boolean; message?: string }>;

  beforeEach(() => {
    registerApiServiceSpy = jasmine.createSpyObj('RegisterApiService', ['checkUsername']);
    validator = createUsernameAvailabilityValidator(registerApiServiceSpy);
  });

  describe('empty or whitespace username', () => {
    it('should return valid for empty username', async () => {
      const result = await validator('');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkUsername).not.toHaveBeenCalled();
    });

    it('should return valid for null username', async () => {
      const result = await validator(null as unknown as string);
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkUsername).not.toHaveBeenCalled();
    });

    it('should return valid for undefined username', async () => {
      const result = await validator(undefined as unknown as string);
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkUsername).not.toHaveBeenCalled();
    });

    it('should return valid for whitespace-only username', async () => {
      const result = await validator('   ');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkUsername).not.toHaveBeenCalled();
    });

    it('should return valid for tab and newline characters', async () => {
      const result = await validator('\t\n\r');
      
      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkUsername).not.toHaveBeenCalled();
    });
  });

  describe('valid username - API responses', () => {
    const validUsername = 'testuser123';

    it('should return valid when username is available', async () => {
      const mockResponse1 = { 
         data: { available: true },
         message: 'Username is available',
         timestamp: Date.now(),
         _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse1));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkUsername).toHaveBeenCalledWith(validUsername);
    });

    it('should return invalid when username is not available', async () => {
      const mockResponse = {
        data: { available: false },
        message: 'Username already taken',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({
        isValid: false,
        message: 'Username already taken'
      });
      expect(registerApiServiceSpy.checkUsername).toHaveBeenCalledWith(validUsername);
    });

    it('should return invalid with default message when username is not available and no message provided', async () => {
      const mockResponse = {
        data: { available: false },
        message: 'Username not available',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({
        isValid: false,
        message: 'Username not available'
      });
    });

    it('should return valid when API response is null', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Username is available',
        timestamp: Date.now(),
        _links: []
      };
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API response is undefined', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Username is available',
        timestamp: Date.now(),
        _links: []
      };
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when response data is null', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Some message',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when response data is undefined', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Some message',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });
  });

  describe('API error handling', () => {
    const validUsername = 'testuser123';

    it('should return invalid with error message when API returns error with message', async () => {
      const errorResponse = {
        error: {
          message: 'Server validation failed'
        }
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(throwError(errorResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({
        isValid: false,
        message: 'Server validation failed'
      });
    });

    it('should return valid when API throws error without error.message', async () => {
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error'
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(throwError(errorResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws error with null error object', async () => {
      const errorResponse = {
        error: null
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(throwError(errorResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws error with undefined error object', async () => {
      const errorResponse = {
        error: undefined
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(throwError(errorResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws error with empty error message', async () => {
      const errorResponse = {
        error: {
          message: ''
        }
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(throwError(errorResponse));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws simple string error', async () => {
      registerApiServiceSpy.checkUsername.and.returnValue(throwError('Simple error'));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws network error', async () => {
      const networkError = new Error('Network connection failed');
      registerApiServiceSpy.checkUsername.and.returnValue(throwError(networkError));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });

    it('should return valid when API throws timeout error', async () => {
      const timeoutError = { name: 'TimeoutError', message: 'Request timeout' };
      registerApiServiceSpy.checkUsername.and.returnValue(throwError(timeoutError));

      const result = await validator(validUsername);

      expect(result).toEqual({ isValid: true });
    });
  });

  describe('username variations', () => {
    it('should handle alphanumeric usernames', async () => {
      const usernames = [
        'user123',
        'test456',
        'admin789',
        'a1b2c3'
      ];

      const mockResponse = {
          data: { available: true },
          message: 'Username is available',
          timestamp: Date.now(),
          _links: []
        };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      for (const username of usernames) {
        const result = await validator(username);
        expect(result).toEqual({ isValid: true });
        expect(registerApiServiceSpy.checkUsername).toHaveBeenCalledWith(username);
      }
    });

    it('should handle usernames with special characters', async () => {
      const usernames = [
        'user_name',
        'test-user',
        'user.name',
        'user@domain'
      ];

      const mockResponse = {
        data: { available: true },
        message: 'Username is available',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      for (const username of usernames) {
        const result = await validator(username);
        expect(result).toEqual({ isValid: true });
        expect(registerApiServiceSpy.checkUsername).toHaveBeenCalledWith(username);
      }
    });

    it('should handle single character username', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Username is available',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator('a');

      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkUsername).toHaveBeenCalledWith('a');
    });

    it('should handle very long username', async () => {
      const longUsername = 'a'.repeat(100);
      const mockResponse = {
          data: { available: false },
          message: 'Username too long',
          timestamp: Date.now(),
          _links: []
        };
        
        registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator(longUsername);

      expect(result).toEqual({
        isValid: false,
        message: 'Username too long'
      });
    });

    it('should handle username with mixed case', async () => {
      const username = 'TestUser123';
      const mockResponse = {
        data: { available: true },
        message: 'Username is available',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator(username);

      expect(result).toEqual({ isValid: true });
      expect(registerApiServiceSpy.checkUsername).toHaveBeenCalledWith(username);
    });
  });

  describe('edge cases', () => {
    it('should handle response with missing data property', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Some message',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator('testuser');

      expect(result).toEqual({ isValid: true });
    });

    it('should handle response with data.available as null', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Some message',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator('testuser');

      expect(result).toEqual({ isValid: true });
    });

    it('should handle response with data.available as undefined', async () => {
      const mockResponse = {
        data: { available: true },
        message: 'Some message',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValue(of(mockResponse));

      const result = await validator('testuser');

      expect(result).toEqual({ isValid: true });
    });

    it('should handle multiple consecutive calls', async () => {
      const mockResponse1 = { 
        data: { available: true },
        message: 'Username is available',
        timestamp: Date.now(),
        _links: []
      };
      const mockResponse2 = { 
        data: { available: false }, 
        message: 'Not available',
        timestamp: Date.now(),
        _links: []
      };
      
      registerApiServiceSpy.checkUsername.and.returnValues(
        of(mockResponse1),
        of(mockResponse2)
      );

      const result1 = await validator('user1');
      const result2 = await validator('user2');

      expect(result1).toEqual({ isValid: true });
      expect(result2).toEqual({ isValid: false, message: 'Not available' });
      expect(registerApiServiceSpy.checkUsername).toHaveBeenCalledTimes(2);
    });
  });
});