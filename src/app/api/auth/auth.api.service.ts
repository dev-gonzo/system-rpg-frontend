import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '@app/core/tokens/api-base-url.token';

import { AuthRequest, AuthResponse, AuthResponseLogout, RefreshTokenRequest } from './auth.api.types';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  basePath  = '/api/v1';
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_URL);

  login(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}${this.basePath}/login`, data);
  }

  logout(){
    return this.http.post<AuthResponseLogout>(`${this.baseUrl}${this.basePath}/logout`, {});
  }

  refreshToken(data: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}${this.basePath}/refresh`, data);
  }
}
