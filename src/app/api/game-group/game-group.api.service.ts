import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from '@app/core/tokens/api-base-url.token';
import {
  GameGroupCreateRequest,
  GameGroupMyGroupsResponse,
  GameGroupResponse,
} from './game-group.api.types';
import { GameGroupPartialUpdate } from '@app/features/game-group/types/game-group-update.types';

@Injectable({ providedIn: 'root' })
export class GameGroupApiService {
  basePath = '/api/v1/game-groups';
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_URL);

  create(data: GameGroupCreateRequest): Observable<GameGroupResponse> {
    return this.http.post<GameGroupResponse>(
      `${this.baseUrl}${this.basePath}`,
      data,
    );
  }

  myGroups(
    page: number = 0,
    size: number = 20,
    sort?: string[],
  ): Observable<GameGroupMyGroupsResponse> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', page.toString());
    httpParams = httpParams.set('size', size.toString());

    if (sort && sort.length > 0) {
      sort.forEach((sortParam) => {
        httpParams = httpParams.append('sort', sortParam);
      });
    }

    return this.http.get<GameGroupMyGroupsResponse>(
      `${this.baseUrl}${this.basePath}/my-groups`,
      { params: httpParams },
    );
  }

  search(
    page: number = 0,
    size: number = 20,
    campaignName?: string,
    sort?: string[],
  ): Observable<GameGroupMyGroupsResponse> {
    let httpParams = new HttpParams();

    httpParams = httpParams.set('page', page.toString());
    httpParams = httpParams.set('size', size.toString());

    if (campaignName && campaignName.trim()) {
      httpParams = httpParams.set('campaignName', campaignName.trim());
    }

    if (sort && sort.length > 0) {
      sort.forEach((sortParam) => {
        httpParams = httpParams.append('sort', sortParam);
      });
    }

    return this.http.get<GameGroupMyGroupsResponse>(
      `${this.baseUrl}${this.basePath}`,
      { params: httpParams },
    );
  }

  getById(id: string): Observable<GameGroupResponse> {
    return this.http.get<GameGroupResponse>(`${this.baseUrl}${this.basePath}/${id}`);
  }

  update(id: string, data: GameGroupPartialUpdate): Observable<GameGroupResponse> {
    return this.http.put<GameGroupResponse>(
      `${this.baseUrl}${this.basePath}/${id}`,
      data,
    );
  }

  updateGameGroupStatus(id: string, data: { isActive: boolean }): Observable<GameGroupResponse> {
    return this.http.patch<GameGroupResponse>(
      `${this.baseUrl}${this.basePath}/${id}/status`,
      data,
    );
  }

  deleteGameGroup(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.basePath}/${id}`);
  }
}
