import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@app/auth/service/auth.service';

export const GuestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const isLoggedIn = authService.isLoggedIn();


  if (token && isLoggedIn) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
