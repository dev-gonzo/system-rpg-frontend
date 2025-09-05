import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '@app/core/tokens/api-base-url.token';
import { RegisterRequest, RegisterResponse, CheckAvailabilityResponse } from './register.api.types';

@Injectable({ providedIn: 'root' })
export class RegisterApiService {
  basePath = '/api/v1/users';
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_URL);

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.baseUrl}${this.basePath}/register`,
      data,
    );
  }

  checkUsername(username: string): Observable<CheckAvailabilityResponse> {
    return this.http.get<CheckAvailabilityResponse>(
      `${this.baseUrl}${this.basePath}/check-username`,
      { params: { username } }
    );
  }

  checkEmail(email: string): Observable<CheckAvailabilityResponse> {
    return this.http.get<CheckAvailabilityResponse>(
      `${this.baseUrl}${this.basePath}/check-email`,
      { params: { email } }
    );
  }
}
