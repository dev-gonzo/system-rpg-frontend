import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { authErrorInterceptor } from './auth-error.interceptor';
import { AuthService } from '../service/auth.service';

describe('AuthErrorInterceptor', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockNext: jasmine.Spy<HttpHandlerFn>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logoutSilent']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockNext = jasmine.createSpy('HttpHandlerFn');
  });

  it('should pass through successful requests', (done) => {
    const request = new HttpRequest('GET', '/api/test');
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(request, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          expect(mockAuthService.logoutSilent).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should logout on 401 error for non-public API requests', (done) => {
    const request = new HttpRequest('GET', '/api/protected');
    const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    mockNext.and.returnValue(throwError(() => error));

    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(request, mockNext);
      
      result.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(mockAuthService.logoutSilent).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should logout on 403 error for non-public API requests', (done) => {
    const request = new HttpRequest('GET', '/api/protected');
    const error = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
    mockNext.and.returnValue(throwError(() => error));

    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(request, mockNext);
      
      result.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(mockAuthService.logoutSilent).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should not logout on 401 error for login API request', (done) => {
    const request = new HttpRequest('POST', '/auth/api/v1/login', {});
    const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    mockNext.and.returnValue(throwError(() => error));

    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(request, mockNext);
      
      result.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(mockAuthService.logoutSilent).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should not logout on 401 error for register API request', (done) => {
    const request = new HttpRequest('POST', '/auth/api/v1/register', {});
    const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    mockNext.and.returnValue(throwError(() => error));

    TestBed.runInInjectionContext(() => {
      const result = authErrorInterceptor(request, mockNext);
      
      result.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(mockAuthService.logoutSilent).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });






});