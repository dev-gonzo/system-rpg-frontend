import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthApiService } from './auth.api.service';
import { API_URL } from '@app/core/tokens/api-base-url.token';
import { AuthRequest, AuthResponse, AuthResponseLogout, RefreshTokenRequest } from './auth.api.types';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://localhost:8080';
const basePath = '/api/v1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthApiService,
        { provide: API_URL, useValue: mockBaseUrl }
      ]
    });
    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send POST request to login endpoint with correct data', () => {
      const mockAuthRequest: AuthRequest = {
        username: 'testuser',
        password: 'testpassword'
      };

      const mockAuthResponse: AuthResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        expiresAt: '2024-01-01T12:00:00Z',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['USER'],
          isActive: true,
          isEmailVerified: true,
          lastLoginAt: '2024-01-01T11:00:00Z'
        }
      };

      service.login(mockAuthRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockAuthRequest);
      req.flush(mockAuthResponse);
    });

    it('should handle login error', () => {
      const mockAuthRequest: AuthRequest = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      service.login(mockAuthRequest).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should send POST request to logout endpoint', () => {
      const mockLogoutResponse: AuthResponseLogout = {
        message: 'Logout successful',
        timestamp: Date.now()
      };

      service.logout().subscribe(response => {
        expect(response).toEqual(mockLogoutResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/logout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockLogoutResponse);
    });

    it('should handle logout error', () => {
      service.logout().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/logout`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('refreshToken', () => {
    it('should send POST request to refresh endpoint with correct data', () => {
      const mockRefreshRequest: RefreshTokenRequest = {
        refreshToken: 'mock-refresh-token',
        accessToken: 'mock-access-token'
      };

      const mockAuthResponse: AuthResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        expiresAt: '2024-01-01T13:00:00Z',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          fullName: 'Test User',
          roles: ['USER'],
          isActive: true,
          isEmailVerified: true,
          lastLoginAt: '2024-01-01T12:00:00Z'
        }
      };

      service.refreshToken(mockRefreshRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRefreshRequest);
      req.flush(mockAuthResponse);
    });

    it('should handle refresh token error', () => {
      const mockRefreshRequest: RefreshTokenRequest = {
        refreshToken: 'invalid-refresh-token',
        accessToken: 'invalid-access-token'
      };

      service.refreshToken(mockRefreshRequest).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/refresh`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('service properties', () => {
    it('should have correct basePath', () => {
      expect(service.basePath).toBe('/api/v1');
    });
  });
});