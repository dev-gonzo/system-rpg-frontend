import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

import { languageInterceptor } from './language.interceptor';

describe('LanguageInterceptor', () => {
  let mockNext: jasmine.Spy<HttpHandlerFn>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    mockNext = jasmine.createSpy('HttpHandlerFn');
    
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'clear', 'removeItem']);
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy, writable: true });
  });

  afterEach(() => {
    localStorageSpy.clear.calls.reset();
  });

  it('should add Accept-Language header with default pt-BR when no language is stored', (done) => {
    const originalRequest = new HttpRequest('GET', '/api/test');
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = languageInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          expect(mockNext).toHaveBeenCalled();
          
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Accept-Language')).toBe('pt-BR');
          done();
        }
      });
    });
  });

  it('should add Accept-Language header with stored language', (done) => {
    const storedLanguage = 'en-US';
    localStorageSpy.getItem.and.returnValue(storedLanguage);
    
    const originalRequest = new HttpRequest('GET', '/api/test');
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = languageInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Accept-Language')).toBe(storedLanguage);
          done();
        }
      });
    });
  });


  it('should preserve existing headers when adding Accept-Language', (done) => {
    const storedLanguage = 'fr-FR';
    localStorageSpy.getItem.and.returnValue(storedLanguage);
    
    const originalRequest = new HttpRequest('POST', '/api/test', {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'custom-value'
      })
    });
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = languageInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Accept-Language')).toBe(storedLanguage);
          expect(modifiedRequest.headers.get('Content-Type')).toBe('application/json');
          expect(modifiedRequest.headers.get('Authorization')).toBe('Bearer token');
          expect(modifiedRequest.headers.get('X-Custom-Header')).toBe('custom-value');
          done();
        }
      });
    });
  });

  it('should work with different HTTP methods', (done) => {
    const storedLanguage = 'es-ES';
    localStorageSpy.getItem.and.returnValue(storedLanguage);
    
    const originalRequest = new HttpRequest('PUT', '/api/test', { data: 'test' });
    mockNext.and.returnValue(of(new HttpResponse({ body: { success: true } })));

    TestBed.runInInjectionContext(() => {
      const result = languageInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Accept-Language')).toBe(storedLanguage);
          expect(modifiedRequest.method).toBe('PUT');
          expect(modifiedRequest.body).toEqual({ data: 'test' });
          done();
        }
      });
    });
  });

  it('should handle different language formats', (done) => {
    const storedLanguage = 'zh-CN';
    localStorageSpy.getItem.and.returnValue(storedLanguage);
    
    const originalRequest = new HttpRequest('GET', '/api/test');
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = languageInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Accept-Language')).toBe(storedLanguage);
          done();
        }
      });
    });
  });

  it('should override existing Accept-Language header', (done) => {
    const storedLanguage = 'de-DE';
    localStorageSpy.getItem.and.returnValue(storedLanguage);
    
    const originalRequest = new HttpRequest('GET', '/api/test', null, {
      headers: new HttpHeaders().set('Accept-Language', 'en-US') 
    });
    mockNext.and.returnValue(of(new HttpResponse({ body: { data: 'test' } })));

    TestBed.runInInjectionContext(() => {
      const result = languageInterceptor(originalRequest, mockNext);
      
      result.subscribe({
        next: (res) => {
          expect(res).toEqual(jasmine.any(HttpResponse));
          
          const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
          expect(modifiedRequest.headers.get('Accept-Language')).toBe(storedLanguage);
          done();
        }
      });
    });
  });
});