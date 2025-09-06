import { HttpClient } from '@angular/common/http';
import type { TranslationObject } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface ITranslationResource {
  prefix: string;
  suffix: string;
}

export class MultiTranslateHttpLoader implements TranslateLoader {
  private readonly CACHE_KEY_PREFIX = 'ngx-translate-cache';
  private readonly CACHE_VERSION = '1.0.4'; 
  private readonly CACHE_EXPIRY_HOURS = 24; 

  constructor(
    private readonly http: HttpClient,
    private readonly resources: ITranslationResource[] = [
      { prefix: '/assets/i18n/', suffix: '/common.json' },
      { prefix: '/assets/i18n/', suffix: '/validation.json' },
      { prefix: '/assets/i18n/', suffix: '/page.json' },
      { prefix: '/assets/i18n/', suffix: '/rpg.json' }
    ]
  ) {
    this.clearOldCacheVersions();
  }


  getTranslation(lang: string): Observable<TranslationObject> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}-${lang}-${this.CACHE_VERSION}`;
    
    
    const cachedData = this.getCachedTranslation(cacheKey);
    if (cachedData) {
      return of(cachedData);
    }
    const requests = this.resources.map(resource => {
      const path = resource.prefix + lang + resource.suffix;
      return this.http.get<TranslationObject>(path);
    });

    return forkJoin(requests).pipe(
      map((responses: TranslationObject[]) => {
        return responses.reduce((acc, response) => {
          return this.deepMerge(acc, response);
        }, {});
      }),
      tap((mergedTranslations) => {
        
        this.setCachedTranslation(cacheKey, mergedTranslations);
      }),
      catchError((error) => {
        const expiredCache = this.getCachedTranslation(cacheKey, true);
        if (expiredCache) {
          return of(expiredCache);
        }
        throw error;
      })
    );
  }

  private getCachedTranslation(cacheKey: string, allowExpired = false): TranslationObject | null {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) {
        return null;
      }

      const parsedCache = JSON.parse(cached);
      const now = new Date().getTime();
      const cacheTime = parsedCache.timestamp;
      const expiryTime = cacheTime + (this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000);

      if (!allowExpired && now > expiryTime) {
        
        localStorage.removeItem(cacheKey);
        return null;
      }

      return parsedCache.data;
    } catch {
      return null;
    }
  }

  private setCachedTranslation(cacheKey: string, data: TranslationObject): void {
    try {
      const cacheData = {
        data,
        timestamp: new Date().getTime(),
        version: this.CACHE_VERSION
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch {
      
      return;
    }
  }

  private deepMerge(target: TranslationObject, source: TranslationObject): TranslationObject {
    const result = { ...target };
    
    for (const key in source) {
      if (Object.hasOwn(source, key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(
            (result[key] as TranslationObject) || {}, 
            source[key]
          );
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  private clearOldCacheVersions(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            try {
              const parsedCache = JSON.parse(cached);
              if (parsedCache.version !== this.CACHE_VERSION) {
                localStorage.removeItem(key);
              }
            } catch {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch {
      return;
    }
  }

  public clearCache(): void {
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
}