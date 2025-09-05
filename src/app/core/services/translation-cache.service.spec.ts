import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslationCacheService } from './translation-cache.service';

describe('TranslationCacheService', () => {
  let service: TranslationCacheService;
  let translateService: jasmine.SpyObj<TranslateService>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', [
      'use',
      'getDefaultLang',
      'getCurrentLang',
      'getFallbackLang'
    ], {
      currentLang: 'pt-BR'
    });
    
    translateSpy.getCurrentLang.and.returnValue('pt-BR');
    translateSpy.getFallbackLang.and.returnValue('pt-BR');

    
    localStorageSpy = jasmine.createSpyObj('Storage', [
      'getItem',
      'setItem',
      'removeItem',
      'clear'
    ]);
    
    
    spyOn(Object, 'keys').and.returnValue([]);

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateSpy }
      ]
    });

    service = TestBed.inject(TranslationCacheService);
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });
  });

  afterEach(() => {
    
    localStorageSpy.getItem.calls.reset();
    localStorageSpy.setItem.calls.reset();
    localStorageSpy.removeItem.calls.reset();
    (Object.keys as jasmine.Spy).calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCacheInfo', () => {
    it('should return empty array when no cache exists', () => {
      (Object.keys as jasmine.Spy).and.returnValue([]);
      
      const result = service.getCacheInfo();
      
      expect(result).toEqual([]);
    });



    it('should handle invalid JSON in cache gracefully', () => {
      const mockKeys = ['ngx-translate-cache-pt-BR-v1'];
      
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);
      localStorageSpy.getItem.and.returnValue('invalid-json');

      const result = service.getCacheInfo();

      expect(result).toEqual([]);
    });

    it('should handle localStorage access errors', () => {
      (Object.keys as jasmine.Spy).and.throwError('localStorage not available');

      const result = service.getCacheInfo();

      expect(result).toEqual([]);
    });

    it('should sort cache info by timestamp descending', () => {
      const mockKeys = [
        'ngx-translate-cache-pt-BR-v1',
        'ngx-translate-cache-en-US-v1'
      ];
      
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key.includes('pt-BR')) {
          return JSON.stringify({ timestamp: 1000, version: 'v1' });
        }
        if (key.includes('en-US')) {
          return JSON.stringify({ timestamp: 2000, version: 'v1' });
        }
        return null;
      });

      const result = service.getCacheInfo();

      expect(result[0].timestamp).toBe(2000);
      expect(result[1].timestamp).toBe(1000);
    });
  });

  describe('clearAllCache', () => {
    it('should remove all cache keys from localStorage', () => {
      const mockKeys = [
        'ngx-translate-cache-pt-BR-v1',
        'ngx-translate-cache-en-US-v1',
        'other-key'
      ];
      
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);

      service.clearAllCache();

      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('ngx-translate-cache-pt-BR-v1');
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('ngx-translate-cache-en-US-v1');
      expect(localStorageSpy.removeItem).not.toHaveBeenCalledWith('other-key');
    });

    it('should handle localStorage access errors gracefully', () => {
      (Object.keys as jasmine.Spy).and.throwError('localStorage not available');

      expect(() => service.clearAllCache()).not.toThrow();
    });
  });

  describe('clearLanguageCache', () => {
    it('should remove cache keys for specific language', () => {
      const mockKeys = [
        'ngx-translate-cache-pt-BR-v1',
        'ngx-translate-cache-en-US-v1',
        'ngx-translate-cache-pt-BR-v2'
      ];
      
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);

      service.clearLanguageCache('pt-BR');

      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('ngx-translate-cache-pt-BR-v1');
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('ngx-translate-cache-pt-BR-v2');
      expect(localStorageSpy.removeItem).not.toHaveBeenCalledWith('ngx-translate-cache-en-US-v1');
    });

    it('should handle localStorage access errors gracefully', () => {
      (Object.keys as jasmine.Spy).and.throwError('localStorage not available');

      expect(() => service.clearLanguageCache('pt-BR')).not.toThrow();
    });
  });

  describe('reloadTranslations', () => {
    beforeEach(() => {
      translateService.use.and.returnValue(of({}));
      translateService.getDefaultLang.and.returnValue('en-US');
    });

    it('should use provided language', async () => {
      const mockKeys = ['ngx-translate-cache-es-ES-v1'];
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);

      await service.reloadTranslations('es-ES');

      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('ngx-translate-cache-es-ES-v1');
      expect(translateService.use).toHaveBeenCalledWith('es-ES');
    });

    it('should use current language when no language provided', async () => {
      const mockKeys = ['ngx-translate-cache-pt-BR-v1'];
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);
      translateService.getCurrentLang.and.returnValue('pt-BR');

      await service.reloadTranslations();

      expect(translateService.use).toHaveBeenCalledWith('pt-BR');
    });

  

    it('should fallback to pt-BR when no language is available', async () => {
      const mockKeys = ['ngx-translate-cache-pt-BR-v1'];
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);
      Object.defineProperty(translateService, 'currentLang', { value: '', configurable: true });
      translateService.getDefaultLang.and.returnValue('');

      await service.reloadTranslations();

      expect(translateService.use).toHaveBeenCalledWith('pt-BR');
    });
  });

  describe('getTotalCacheSize', () => {
    it('should return total size of all cache entries', () => {
      const mockKeys = [
        'ngx-translate-cache-pt-BR-v1',
        'ngx-translate-cache-en-US-v1',
        'other-key'
      ];
      
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);
      localStorageSpy.getItem.and.callFake((key: string) => {
        if (key.startsWith('ngx-translate-cache')) {
          return 'test-data'; 
        }
        return null;
      });

      const result = service.getTotalCacheSize();

      expect(result).toBe(18); 
    });

    it('should return 0 when no cache exists', () => {
      (Object.keys as jasmine.Spy).and.returnValue([]);

      const result = service.getTotalCacheSize();

      expect(result).toBe(0);
    });

    it('should handle localStorage access errors', () => {
      (Object.keys as jasmine.Spy).and.throwError('localStorage not available');

      const result = service.getTotalCacheSize();

      expect(result).toBe(0);
    });
  });

  describe('hasCachedTranslations', () => {
    it('should return true when cache exists for language', () => {
      const mockKeys = [
        'ngx-translate-cache-pt-BR-v1',
        'ngx-translate-cache-en-US-v1'
      ];
      
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);

      const result = service.hasCachedTranslations('pt-BR');

      expect(result).toBe(true);
    });

    it('should return false when no cache exists for language', () => {
      const mockKeys = ['ngx-translate-cache-en-US-v1'];
      
      (Object.keys as jasmine.Spy).and.returnValue(mockKeys);

      const result = service.hasCachedTranslations('pt-BR');

      expect(result).toBe(false);
    });

    it('should handle localStorage access errors', () => {
      (Object.keys as jasmine.Spy).and.throwError('localStorage not available');

      const result = service.hasCachedTranslations('pt-BR');

      expect(result).toBe(false);
    });
  });

  describe('formatSize', () => {
    it('should format bytes correctly', () => {
      expect(service.formatSize(0)).toBe('0 B');
      expect(service.formatSize(512)).toBe('512 B');
      expect(service.formatSize(1024)).toBe('1 KB');
      expect(service.formatSize(1536)).toBe('1.5 KB');
      expect(service.formatSize(1048576)).toBe('1 MB');
      expect(service.formatSize(1073741824)).toBe('1 GB');
    });

    it('should handle decimal values correctly', () => {
      expect(service.formatSize(1536)).toBe('1.5 KB');
      expect(service.formatSize(2560)).toBe('2.5 KB');
    });
  });


});