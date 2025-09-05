import { HttpInterceptorFn } from '@angular/common/http';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  
  const currentLanguage = localStorage.getItem('user-language') ?? 'pt-BR';

  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': currentLanguage
    }
  });

  return next(modifiedReq);
};