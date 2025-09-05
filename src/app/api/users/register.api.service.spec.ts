import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterApiService } from './register.api.service';
import { API_URL } from '@app/core/tokens/api-base-url.token';
import {
  RegisterRequest,
  RegisterResponse,
  CheckAvailabilityResponse,
  RegisterResponseData,
  CheckAvailabilityData
} from './register.api.types';

describe('RegisterApiService', () => {
  let service: RegisterApiService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://localhost:8080';
  const basePath = '/api/v1/users';

  const mockRegisterResponseData: RegisterResponseData = {
    id: '1',
    username: 'newuser',
    email: 'newuser@example.com',
    firstName: 'New',
    lastName: 'User',
    roles: [{ id: '1', name: 'USER', description: 'User role', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }],
    isActive: true,
    isEmailVerified: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    passwordChangedAt: '2024-01-01T10:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RegisterApiService,
        { provide: API_URL, useValue: mockBaseUrl }
      ]
    });
    service = TestBed.inject(RegisterApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should send POST request to register endpoint with correct data', () => {
      const registerRequest: RegisterRequest = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        roles: ['USER']
      };

      const mockResponse: RegisterResponse = {
        message: 'User registered successfully',
        timestamp: Date.now(),
        data: mockRegisterResponseData,
        _links: []
      };

      service.register(registerRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(mockResponse);
    });

    it('should handle registration validation error', () => {
      const registerRequest: RegisterRequest = {
        username: '',
        email: 'invalid-email',
        password: '123',
        firstName: '',
        lastName: '',
        roles: []
      };

      service.register(registerRequest).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/register`);
      req.flush('Validation failed', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle username already exists error', () => {
      const registerRequest: RegisterRequest = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        roles: ['USER']
      };

      service.register(registerRequest).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/register`);
      req.flush('Username already exists', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('checkUsername', () => {
    it('should send GET request to check username availability when available', () => {
      const username = 'availableuser';
      const _mockAvailabilityData: CheckAvailabilityData = {
        available: true
      };
      const mockResponse: CheckAvailabilityResponse = {
        message: 'Username is available',
        timestamp: Date.now(),
        data: { available: true },
        _links: []
      };

      service.checkUsername(username).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data.available).toBe(true);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/check-username?username=${username}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should send GET request to check username availability when not available', () => {
      const username = 'takenuser';
      const _mockAvailabilityData: CheckAvailabilityData = {
        available: false
      };
      const mockResponse: CheckAvailabilityResponse = {
        message: 'Username is not available',
        timestamp: Date.now(),
        data: { available: false },
        _links: []
      };

      service.checkUsername(username).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data.available).toBe(false);
      });

      const req = httpMock.expectOne(request => {
        return request.url === `${mockBaseUrl}${basePath}/check-username` &&
               request.params.get('username') === username;
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty username parameter', () => {
      const username = '';
      const mockResponse: CheckAvailabilityResponse = {
        message: 'Username availability checked',
        timestamp: Date.now(),
        data: { available: false },
        _links: []
      };

      service.checkUsername(username).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/check-username?username=`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('checkEmail', () => {
    it('should send GET request to check email availability when available', () => {
      const email = 'available@example.com';
      const _mockAvailabilityData: CheckAvailabilityData = {
        available: true
      };
      const mockResponse: CheckAvailabilityResponse = {
        message: 'Email is available',
        timestamp: Date.now(),
        data: { available: true },
        _links: []
      };

      service.checkEmail(email).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data.available).toBe(true);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/check-email?email=${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should send GET request to check email availability when not available', () => {
      const email = 'taken@example.com';
      const _mockAvailabilityData: CheckAvailabilityData = {
        available: false
      };
      const mockResponse: CheckAvailabilityResponse = {
        message: 'Email is not available',
        timestamp: Date.now(),
        data: { available: false },
        _links: []
      };

      service.checkEmail(email).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data.available).toBe(false);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/check-email?email=${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle invalid email format', () => {
      const email = 'invalid-email';

      service.checkEmail(email).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/check-email?email=${email}`);
      req.flush('Invalid email format', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('service properties', () => {
    it('should have correct basePath', () => {
      expect(service.basePath).toBe('/api/v1/users');
    });
  });
});