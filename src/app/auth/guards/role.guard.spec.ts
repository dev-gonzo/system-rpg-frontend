import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { GuardResult } from '@angular/router';

import { createRoleGuard, AdminManagerGuard, UserWithRoles } from './role.guard';
import { AuthService } from '../service/auth.service';

describe('RoleGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUserWithRoles: UserWithRoles = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['USER', 'ADMIN'],
    isActive: true,
    isEmailVerified: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    passwordChangedAt: '2023-01-01T00:00:00Z'
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'ensureValidToken', 'getUserData']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('createRoleGuard', () => {
    it('should redirect to login when user is not logged in', () => {
      const guard = createRoleGuard(['ADMIN']);
      mockAuthService.isLoggedIn.and.returnValue(false);

      const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should redirect to login when token is invalid', (done) => {
      const guard = createRoleGuard(['ADMIN']);
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(false));

      const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

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

    it('should redirect to home when user has no user data', (done) => {
      const guard = createRoleGuard(['ADMIN']);
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(true));
      mockAuthService.getUserData.and.returnValue(null);

      const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      if (result instanceof Observable) {
        result.subscribe((canActivate: GuardResult) => {
          expect(canActivate).toBe(false);
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should redirect to home when user has no roles', (done) => {
      const guard = createRoleGuard(['ADMIN']);
      const userWithoutRoles = { ...mockUserWithRoles, roles: undefined };
      
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(true));
      mockAuthService.getUserData.and.returnValue(userWithoutRoles);

      const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      if (result instanceof Observable) {
        result.subscribe((canActivate: GuardResult) => {
          expect(canActivate).toBe(false);
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should redirect to home when user does not have required role', (done) => {
      const guard = createRoleGuard(['SUPER_ADMIN']);
      
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(true));
      mockAuthService.getUserData.and.returnValue(mockUserWithRoles);

      const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      if (result instanceof Observable) {
        result.subscribe((canActivate: GuardResult) => {
          expect(canActivate).toBe(false);
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should allow access when user has required role', (done) => {
      const guard = createRoleGuard(['ADMIN']);
      
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(true));
      mockAuthService.getUserData.and.returnValue(mockUserWithRoles);

      const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

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

    it('should allow access when user has one of multiple required roles', (done) => {
      const guard = createRoleGuard(['SUPER_ADMIN', 'ADMIN']);
      
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(true));
      mockAuthService.getUserData.and.returnValue(mockUserWithRoles);

      const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

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

    it('should redirect to login when token validation throws error', (done) => {
      const guard = createRoleGuard(['ADMIN']);
      
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(throwError(() => new Error('Token validation failed')));

      const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

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

  describe('AdminManagerGuard', () => {
    it('should allow access for ADMIN role', (done) => {
      const userWithAdminRole = { ...mockUserWithRoles, roles: ['ADMIN'] };
      
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(true));
      mockAuthService.getUserData.and.returnValue(userWithAdminRole);

      const result = TestBed.runInInjectionContext(() => AdminManagerGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      if (result instanceof Observable) {
        result.subscribe((canActivate: GuardResult) => {
          expect(canActivate).toBe(true);
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should allow access for MANAGER role', (done) => {
      const userWithManagerRole = { ...mockUserWithRoles, roles: ['MANAGER'] };
      
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(true));
      mockAuthService.getUserData.and.returnValue(userWithManagerRole);

      const result = TestBed.runInInjectionContext(() => AdminManagerGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      if (result instanceof Observable) {
        result.subscribe((canActivate: GuardResult) => {
          expect(canActivate).toBe(true);
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });

    it('should deny access for USER role only', (done) => {
      const userWithUserRole = { ...mockUserWithRoles, roles: ['USER'] };
      
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.ensureValidToken.and.returnValue(of(true));
      mockAuthService.getUserData.and.returnValue(userWithUserRole);

      const result = TestBed.runInInjectionContext(() => AdminManagerGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

      if (result instanceof Observable) {
        result.subscribe((canActivate: GuardResult) => {
          expect(canActivate).toBe(false);
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
          done();
        });
      } else {
        fail('Expected Observable but got boolean');
      }
    });
  });
});