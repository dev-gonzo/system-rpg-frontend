import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '@app/core/tokens/api-base-url.token';
import {
  UserSearchParams,
  UserSearchResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserGetByIdResponse,
  UserUpdateRequest,
  UserUpdateResponse,
  UserDeleteResponse,
  UserToggleStatusResponse,
  UserVerifyEmailResponse
} from './users.api.types';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  basePath = '/api/v1/users';
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_URL);

  listUsers(page: number = 0, size: number = 20, sort?: string[]): Observable<UserSearchResponse> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', page.toString());
    httpParams = httpParams.set('size', size.toString());
    
    if (sort && sort.length > 0) {
      sort.forEach(sortParam => {
        httpParams = httpParams.append('sort', sortParam);
      });
    }

    return this.http.get<UserSearchResponse>(
      `${this.baseUrl}${this.basePath}`,
      { params: httpParams }
    );
  }

  searchUsers(params: UserSearchParams): Observable<UserSearchResponse> {
    let httpParams = new HttpParams();

    if (params.username) {
      httpParams = httpParams.set('username', params.username);
    }
    if (params.firstName) {
      httpParams = httpParams.set('firstName', params.firstName);
    }
    if (params.lastName) {
      httpParams = httpParams.set('lastName', params.lastName);
    }
    if (params.email) {
      httpParams = httpParams.set('email', params.email);
    }
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach(sortParam => {
        httpParams = httpParams.append('sort', sortParam);
      });
    }

    return this.http.get<UserSearchResponse>(
      `${this.baseUrl}${this.basePath}/search`,
      { params: httpParams }
    );
  }

  getUserById(userId: string): Observable<UserGetByIdResponse> {
    return this.http.get<UserGetByIdResponse>(
      `${this.baseUrl}${this.basePath}/${userId}`
    );
  }

  createUser(data: UserCreateRequest): Observable<UserCreateResponse> {
    return this.http.post<UserCreateResponse>(
      `${this.baseUrl}${this.basePath}`,
      data
    );
  }

  updateUser(userId: string, data: UserUpdateRequest): Observable<UserUpdateResponse> {
    return this.http.put<UserUpdateResponse>(
      `${this.baseUrl}${this.basePath}/${userId}`,
      data
    );
  }

  deleteUser(userId: string): Observable<UserDeleteResponse> {
    return this.http.delete<UserDeleteResponse>(
      `${this.baseUrl}${this.basePath}/${userId}`
    );
  }

  toggleUserStatus(userId: string, active: boolean): Observable<UserToggleStatusResponse> {
    const params = new HttpParams().set('active', active.toString());
    return this.http.patch<UserToggleStatusResponse>(
      `${this.baseUrl}${this.basePath}/${userId}/status`,
      {},
      { params }
    );
  }

  verifyUserEmail(userId: string): Observable<UserVerifyEmailResponse> {
    return this.http.patch<UserVerifyEmailResponse>(
      `${this.baseUrl}${this.basePath}/${userId}/verify-email`,
      {}
    );
  }
}