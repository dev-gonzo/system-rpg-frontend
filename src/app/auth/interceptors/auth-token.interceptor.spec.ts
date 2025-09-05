import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

import { authTokenInterceptor } from './auth-token.interceptor';
import { AuthService } from '../service/auth.service';

describe('authTokenInterceptor', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNext: jasmine.Spy<HttpHandlerFn>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockNext = jasmine.createSpy('HttpHandlerFn');
  });

  it('should add Authorization header when token exists', (done) => {
    const token = 'test-token';
    const originalRequest = new HttpRequest('GET', '/api/test');
    
    mockAuthService.getToken.and.returnValue(token);
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = authTokenInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          expect(mockNext).toHaveBeenCalled();
          
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
          done();
        }
      });
    });
  });

  it('should not modify request when no token exists', (done) => {
    const originalRequest = new HttpRequest('GET', '/api/test');
    
    mockAuthService.getToken.and.returnValue(null);
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = authTokenInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          expect(mockNext).toHaveBeenCalledWith(originalRequest);
          done();
        }
      });
    });
  });

  it('should not modify request when token is empty string', (done) => {
    const originalRequest = new HttpRequest('GET', '/api/test');
    
    mockAuthService.getToken.and.returnValue('');
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = authTokenInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          expect(mockNext).toHaveBeenCalledWith(originalRequest);
          done();
        }
      });
    });
  });

  it('should preserve existing headers when adding Authorization', (done) => {
    const token = 'test-token';
    const originalRequest = new HttpRequest('POST', '/api/test', {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Custom-Header': 'custom-value'
      })
    });
    
    mockAuthService.getToken.and.returnValue(token);
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = authTokenInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
          expect(modifiedRequest.headers.get('Content-Type')).toBe('application/json');
          expect(modifiedRequest.headers.get('X-Custom-Header')).toBe('custom-value');
          done();
        }
      });
    });
  });

  it('should work with different HTTP methods', (done) => {
    const token = 'test-token';
    const originalRequest = new HttpRequest('POST', '/api/test', { data: 'test' });
    
    mockAuthService.getToken.and.returnValue(token);
    mockNext.and.returnValue(of(new HttpResponse({ body: { success: true } })));

    TestBed.runInInjectionContext(() => {
      const result = authTokenInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
          expect(modifiedRequest.method).toBe('POST');
          expect(modifiedRequest.body).toEqual({ data: 'test' });
          done();
        }
      });
    });
  });

  it('should handle undefined token', (done) => {
    const originalRequest = new HttpRequest('GET', '/api/test');
    
    mockAuthService.getToken.and.returnValue(null);
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = authTokenInterceptor(originalRequest, mockNext);
      
   result.subscribe({
          next: (res) => {
            expect(res).toEqual(jasmine.any(HttpResponse));
            expect(mockNext).toHaveBeenCalledWith(originalRequest);
            done();
          }
        });
    });
  });
});