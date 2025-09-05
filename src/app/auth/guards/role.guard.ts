import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

import { AuthService } from '@app/auth/service/auth.service';

export interface UserWithRoles {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  passwordChangedAt: string;
}

export const createRoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/auth/login']);
      return false;
    }

    return authService.ensureValidToken().pipe(
      map((isValid) => {
        if (!isValid) {
          router.navigate(['/auth/login']);
          return false;
        }

        const userData = authService.getUserData() as UserWithRoles;
        if (!userData?.roles) {
          router.navigate(['/']);
          return false;
        }

        const userRoles = userData.roles;
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
          router.navigate(['/']);
          return false;
        }

        return true;
      }),
      catchError(() => {
        router.navigate(['/auth/login']);
        return of(false);
      }),
    );
  };
};


export const AdminManagerGuard: CanActivateFn = createRoleGuard(['ADMIN', 'MANAGER']);