import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '@app/auth/service/auth.service';

export const authErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);

  const publicApiUrls = [
    '/api/v1/login',
    '/api/v1/register',
    '/assets/i18n/',
  ];

  const isPublicApiRequest = publicApiUrls.some((url) => req.url.includes(url));

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        (error.status === 401 || error.status === 403) &&
        !isPublicApiRequest
      ) {
        authService.logoutSilent();
      }

      return throwError(() => error);
    }),
  );
};
