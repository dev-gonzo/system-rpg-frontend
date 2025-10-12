import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '@app/core/tokens/api-base-url.token';
import {
  AdventureCreateRequest,
  AdventureListResponse,
  AdventureResponse,
  AdventureUpdateRequest,
} from './adventure.api.types';

@Injectable({ providedIn: 'root' })
export class AdventureApiService {
  basePath = '/api/v1/adventures';
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_URL);

  create(gameGroupId: string, data: AdventureCreateRequest): Observable<AdventureResponse> {
    const body = { ...data, gameGroupId };
    return this.http.post<AdventureResponse>(
      `${this.baseUrl}/api/v1/adventures`,
      body,
    );
  }

  listByGroup(
    gameGroupId: string,
    page: number = 0,
    size: number = 20,
    sort?: string[],
  ): Observable<AdventureListResponse> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', page.toString());
    httpParams = httpParams.set('size', size.toString());

    if (sort && sort.length > 0) {
      sort.forEach((sortParam) => {
        httpParams = httpParams.append('sort', sortParam);
      });
    }

    httpParams = httpParams.set('gameGroupId', gameGroupId);

    return this.http.get<AdventureListResponse>(
      `${this.baseUrl}/api/v1/adventures`,
      { params: httpParams },
    );
  }

  getById(adventureId: string): Observable<AdventureResponse> {
    return this.http.get<AdventureResponse>(
      `${this.baseUrl}${this.basePath}/${adventureId}`,
    );
  }

  update(adventureId: string, data: AdventureUpdateRequest): Observable<AdventureResponse> {
    return this.http.put<AdventureResponse>(
      `${this.baseUrl}${this.basePath}/${adventureId}`,
      data,
    );
  }

  delete(adventureId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${this.basePath}/${adventureId}`,
    );
  }
}