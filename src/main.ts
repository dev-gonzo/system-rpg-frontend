import {
  provideHttpClient,
  withInterceptors,
  HttpClient,
} from '@angular/common/http';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
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
import { MdiIconsService } from './app/core/services/mdi-icons.service';


export function initializeMdiIcons(mdiIconsService: MdiIconsService) {
  return () => {
    mdiIconsService.registerIcons();
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideNgxMask(),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        languageInterceptor,
        authErrorInterceptor,
        authTokenInterceptor,
      ]),
    ),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => {
            return new MultiTranslateHttpLoader(http);
          },
          deps: [HttpClient],
        },
      }),
    ),
    { provide: API_URL, useValue: environment.apis.endpoint },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMdiIcons,
      deps: [MdiIconsService],
      multi: true
    },
  ],
}).then(() => {
  
  DisableNativeTooltips.init();
}).catch(() => {
  
  return;
});
