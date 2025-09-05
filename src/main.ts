import {
  provideHttpClient,
  withInterceptors,
  HttpClient,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from './app/core/i18n/multi-translate-loader';

import { authErrorInterceptor } from '@app/auth/interceptors/auth-error.interceptor';
import { authTokenInterceptor } from '@app/auth/interceptors/auth-token.interceptor';
import { languageInterceptor } from '@app/auth/interceptors/language.interceptor';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { API_URL } from './app/core/tokens/api-base-url.token';
import { environment } from './environments/environment';
import { DisableNativeTooltips } from './app/core/utils/disable-native-tooltips';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideNgxMask(),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        languageInterceptor,
        authTokenInterceptor,
        authErrorInterceptor,
      ]),
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => {
            return new MultiTranslateHttpLoader(http, [
              { prefix: './assets/i18n/', suffix: '.json' }
            ]);
          },
          deps: [HttpClient],
        },
      }),
    ),
    { provide: API_URL, useValue: environment.apis.endpoint },
  ],
}).then(() => {
  
  DisableNativeTooltips.init();
}).catch(() => {
  
  return;
});
