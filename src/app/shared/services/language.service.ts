import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'pt-BR' | 'en-US' | 'es-ES';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  shortCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'user-language';
  private readonly _language = signal<Language>(this.loadLanguage());

  readonly language = this._language.asReadonly();

  readonly availableLanguages: LanguageOption[] = [
    { code: 'pt-BR', name: 'COMMON.LANGUAGES.PT_BR', flag: '🇧🇷', shortCode: 'BR' },
    { code: 'en-US', name: 'COMMON.LANGUAGES.EN_US', flag: '🇺🇸', shortCode: 'US' },
    { code: 'es-ES', name: 'COMMON.LANGUAGES.ES_ES', flag: '🇪🇸', shortCode: 'ES' }
  ];

  private readonly translateService = inject(TranslateService);

  constructor() {
    this.initializeTranslations();
  }

  private initializeTranslations(): void {
    const savedLanguage = this.loadLanguage();
    const translatedCode = this.mapLanguageToTranslateCode(savedLanguage);
    
    this.translateService.use(translatedCode).subscribe({
      next: () => {
        this.applyLanguage();
      },
      error: () => {
        this.translateService.use('pt-BR').subscribe(() => {
          this.applyLanguage();
        });
      }
    });
  }

  mapLanguageToTranslateCode(language: Language): string {
    const mapping: Record<Language, string> = {
      'pt-BR': 'pt-BR',
      'en-US': 'en-US',
      'es-ES': 'es-ES'
    };
    return mapping[language];
  }

  private loadLanguage(): Language {
    return (localStorage.getItem(this.LANGUAGE_KEY) as Language) || 'pt-BR';
  }

  private applyLanguage(): void {
    
    document.documentElement.setAttribute('lang', this._language());
  }

  setLanguage(language: Language): void {
    this._language.set(language);
    localStorage.setItem(this.LANGUAGE_KEY, language);
    
    const translateCode = this.mapLanguageToTranslateCode(language);
    
    this.translateService.use(translateCode).subscribe({
      next: () => {
        this.applyLanguage();
      },
      error: () => {
        return;
      }
    });
  }

  getLanguageOption(code: Language): LanguageOption | undefined {
    return this.availableLanguages.find(lang => lang.code === code);
  }

  getCurrentLanguageOption(): LanguageOption {
    return this.getLanguageOption(this._language()) || this.availableLanguages[0];
  }
}