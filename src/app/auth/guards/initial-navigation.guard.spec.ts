import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { InitialNavigationGuard } from './initial-navigation.guard';
import { AuthService } from '@app/auth/service/auth.service';

describe('InitialNavigationGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let guard: typeof InitialNavigationGuard;
  let mockUrlTree: UrlTree;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    mockUrlTree = {} as UrlTree;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    guard = InitialNavigationGuard;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to home when user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);

    const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    expect(result).toBe(mockUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/home']);
  });

  it('should redirect to login when user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);

    const result = TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

    expect(result).toBe(mockUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
  });
});