import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { GuardResult } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';

describe('AuthGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let guard: typeof AuthGuard;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'ensureValidToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    guard = AuthGuard;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login when user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(mockAuthService.ensureValidToken).not.toHaveBeenCalled();
  });

  it('should allow access when user is logged in and token is valid', (done) => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockAuthService.ensureValidToken.and.returnValue(of(true));

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    if (result instanceof Observable) {
      result.subscribe((canActivate: GuardResult) => {
        expect(canActivate).toBe(true);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      });
    } else {
      fail('Expected Observable but got boolean');
    }
  });

  it('should redirect to login when user is logged in but token is invalid', (done) => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockAuthService.ensureValidToken.and.returnValue(of(false));

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    if (result instanceof Observable) {
      result.subscribe((canActivate: GuardResult) => {
        expect(canActivate).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      });
    } else {
      fail('Expected Observable but got boolean');
    }
  });

  it('should redirect to login when token validation throws error', (done) => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockAuthService.ensureValidToken.and.returnValue(throwError(() => new Error('Token validation failed')));

    const result = TestBed.runInInjectionContext(() => AuthGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    if (result instanceof Observable) {
      result.subscribe((canActivate: GuardResult) => {
        expect(canActivate).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
        done();
      });
    } else {
      fail('Expected Observable but got boolean');
    }
  });
});