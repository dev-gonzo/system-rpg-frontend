import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

export interface CacheInfo {
  language: string;
  timestamp: number;
  version: string;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationCacheService {
  private readonly CACHE_KEY_PREFIX = 'ngx-translate-cache';
  private readonly translateService = inject(TranslateService);

  
  getCacheInfo(): CacheInfo[] {
    const cacheInfo: CacheInfo[] = [];
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            try {
              const parsedCache = JSON.parse(cached);
              const language = key.split('-')[3]; 
              
              cacheInfo.push({
                language,
                timestamp: parsedCache.timestamp,
                version: parsedCache.version,
                size: new Blob([cached]).size
              });
            } catch {
              
              return;
            }
          }
        }
      });
    } catch {
      
      return [];
    }

    return cacheInfo.sort((a, b) => b.timestamp - a.timestamp);
  }

  
  clearAllCache(): void {
    try {
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      
      
    } catch {
      
      return;
    }
  }

  
  clearLanguageCache(language: string): void {
    try {
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX) && key.includes(`-${language}-`)) {
          localStorage.removeItem(key);
        }
      });
      
      
    } catch {
      
      return;
    }
  }

  
  async reloadTranslations(language?: string): Promise<void> {
    const targetLanguage = language ?? this.translateService.getCurrentLang() ?? this.translateService.getFallbackLang() ?? 'pt-BR';
    
    
    this.clearLanguageCache(targetLanguage);
    
    
    await firstValueFrom(this.translateService.use(targetLanguage));
  }

  
  getTotalCacheSize(): number {
    let totalSize = 0;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            totalSize += new Blob([cached]).size;
          }
        }
      });
    } catch {
      
      return 0;
    }

    return totalSize;
  }

  
  hasCachedTranslations(language: string): boolean {
    try {
      const keys = Object.keys(localStorage);
      return keys.some(key => 
        key.startsWith(this.CACHE_KEY_PREFIX) && 
        key.includes(`-${language}-`)
      );
    } catch {
      
      return false;
    }
  }

  
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  
  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('pt-BR');
  }
}