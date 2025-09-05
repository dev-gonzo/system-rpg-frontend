import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly translateService = inject(TranslateService);

  
  translate(key: string, params?: Record<string, unknown>): Observable<string> {
    return this.translateService.get(key, params);
  }

  
  instant(key: string, params?: Record<string, unknown>): string {
    return this.translateService.instant(key, params);
  }

  
  setLanguage(lang: string): Observable<unknown> {
    return this.translateService.use(lang);
  }

  
  getCurrentLanguage(): string {
    return this.translateService.getCurrentLang() ?? this.translateService.getFallbackLang() ?? 'pt-BR';
  }

  
  getDefaultLanguage(): string {
    return this.translateService.getFallbackLang() ?? 'pt-BR';
  }
}