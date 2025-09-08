import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { AuthApiService } from '@app/api/auth/auth.api.service';
import { AuthResponse } from '@app/api/auth/auth.api.types';
import { TranslationService } from '@app/core/i18n/translation.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth-token';
  private readonly REFRESH_TOKEN_KEY = 'refresh-token';
  private readonly EXPIRES_AT_KEY = 'expires-at';
  private readonly USER_KEY = 'user-data';

  private readonly REFRESH_BUFFER_SECONDS = 30;

  private refreshTimer?: ReturnType<typeof setTimeout>;
  public isRefreshing = false;
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

  
  private visibilityChangeListener?: () => void;
  private windowFocusListener?: () => void;

  public isLoggedIn = signal<boolean>(false);
  public currentUser = signal<unknown>(null);

  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly translationService = inject(TranslationService);
  private readonly authApiService = inject(AuthApiService);

   
  constructor() {
    
    this.setupPageVisibilityListener();
  }

  private setupPageVisibilityListener(): void {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      
      this.visibilityChangeListener = () => {
        if (!document.hidden && this.isLoggedIn()) {
          this.checkTokenOnReturn();
        }
      };
      document.addEventListener('visibilitychange', this.visibilityChangeListener);

      
      this.windowFocusListener = () => {
        if (this.isLoggedIn()) {
          this.checkTokenOnReturn();
        }
      };
      window.addEventListener('focus', this.windowFocusListener);
    }
  }

  private cleanupPageVisibilityListeners(): void {
    if (typeof document !== 'undefined' && this.visibilityChangeListener) {
      document.removeEventListener('visibilitychange', this.visibilityChangeListener);
      this.visibilityChangeListener = undefined;
    }
    if (typeof window !== 'undefined' && this.windowFocusListener) {
      window.removeEventListener('focus', this.windowFocusListener);
      this.windowFocusListener = undefined;
    }
  }

  private checkTokenOnReturn(): void {
    this.ensureValidToken().subscribe();
  }

  public async initialize(): Promise<void> {
    await this.waitForTranslationsAndInitialize();
  }

  private async waitForTranslationsAndInitialize(): Promise<void> {
    const currentLang = this.translationService.getCurrentLanguage();
    if (!currentLang || currentLang === '') {
      await new Promise(resolve => {
        const subscription = this.translate.onLangChange.subscribe(() => {
          subscription.unsubscribe();
          resolve(true);
        });
        
        
        setTimeout(() => {
          subscription.unsubscribe();
          resolve(true);
        }, 1000);
      });
    }
    
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    const userData = this.getUserData();

    if (token && userData) {
      this.isLoggedIn.set(true);
      this.currentUser.set(userData);
      
      
      this.ensureValidToken().subscribe({
        next: (isValid) => {
          if (isValid) {
            
            this.scheduleTokenRefresh();
          }
          
        },
        error: () => {
          
          this.logoutSilent();
        }
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getExpiresAt(): string | null {
    return localStorage.getItem(this.EXPIRES_AT_KEY);
  }

  getUserData(): unknown {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(this.EXPIRES_AT_KEY, authResponse.expiresAt);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));

    this.isLoggedIn.set(true);
    this.currentUser.set(authResponse.user);

    this.scheduleTokenRefresh();
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.isLoggedIn.set(false);
    this.currentUser.set(null);

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  logout(): void {
    this.clear();
    this.cleanupPageVisibilityListeners();
    this.router.navigate(['/auth/login']);
    const message = this.translate.instant('COMMON.AUTH.LOGOUT_SUCCESS') ?? 'Logout successful';
    this.toast.success(message);
  }

  logoutSilent(): void {
    this.clear();
    this.cleanupPageVisibilityListeners();
    this.router.navigate(['/auth/login']);
  }

  private checkTokenExpiration(): void {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) {
      return;
    }

    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();

    if (currentTime >= expirationTime) {
      this.attemptTokenRefresh();
    } else {
      this.scheduleTokenRefresh();
    }
  }

  private scheduleTokenRefresh(): void {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return;

    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    const refreshTime = expirationTime - this.REFRESH_BUFFER_SECONDS * 1000;
    const timeUntilRefresh = refreshTime - currentTime;

    if (timeUntilRefresh > 0) {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }

      this.refreshTimer = setTimeout(() => {
        this.attemptTokenRefresh();
      }, timeUntilRefresh);
    } else {
      this.attemptTokenRefresh();
    }
  }

  private performTokenRefresh(): Observable<boolean> {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      this.logoutSilent();
      return new Observable((observer) => {
        observer.next(false);
        observer.complete();
      });
    }

    this.isRefreshing = true;

    return this.authApiService
      .refreshToken({
        accessToken,
        refreshToken,
      })
      .pipe(
        tap((response: AuthResponse) => {
           this.setAuthData(response);
           this.isRefreshing = false;
           this.refreshTokenSubject.next(response.accessToken);
           
           this.scheduleTokenRefresh();
         }),
        switchMap(() => {
          return new Observable<boolean>((observer) => {
            observer.next(true);
            observer.complete();
          });
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);

          if (error.status === 401) {
            const apiMessage = error.error?.message || error.message || error.error?.error || null;
            const message = apiMessage ?? this.translate.instant('COMMON.AUTH.SESSION_EXPIRED') ?? 'Session expired';
            this.toast.warning(message);
            this.logoutSilent();
          } else {
            const apiMessage = error.error?.message || error.message || error.error?.error || null;
            const message = apiMessage ?? this.translate.instant('COMMON.AUTH.REFRESH_ERROR') ?? 'Token refresh failed';
            this.toast.danger(message);
          }

          return new Observable<boolean>((observer) => {
            observer.next(false);
            observer.complete();
          });
        })
      );
  }

  private attemptTokenRefresh(): void {
    if (this.isRefreshing) {
      return;
    }

    this.performTokenRefresh().subscribe();
  }

  public ensureValidToken(): Observable<boolean> {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) {
      this.logoutSilent();
      return EMPTY;
    }

    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    const bufferTime = this.REFRESH_BUFFER_SECONDS * 1000;

    if (currentTime >= expirationTime - bufferTime) {
      if (this.isRefreshing) {
        
        return this.refreshTokenSubject.asObservable().pipe(
          switchMap(() => {
            const newToken = this.getToken();
            return new Observable<boolean>((observer) => {
              observer.next(!!newToken);
              observer.complete();
            });
          })
        );
      }

      
      return this.performTokenRefresh();
    }

    return new Observable((observer) => {
      observer.next(true);
      observer.complete();
    });
  }

  public initializeTokenCheck(): void {
    this.checkTokenExpiration();
  }
}
