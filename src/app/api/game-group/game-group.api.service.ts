import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { API_URL } from '@app/core/tokens/api-base-url.token';
import { BaseResponse } from '@app/core/types/base-response';
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

  addParticipant(groupId: string, userId: string): Observable<GameGroupResponse> {
    
    return this.http.post<GameGroupResponse>(
      `${this.baseUrl}${this.basePath}/${groupId}/participants`,
      { userId, gameGroupId: groupId },
    );
  }

  removeParticipant(groupId: string, userId: string): Observable<GameGroupResponse> {
    return this.http.delete<GameGroupResponse>(
      `${this.baseUrl}${this.basePath}/${groupId}/participants/${userId}`,
    );
  }

  deactivateParticipant(groupId: string, userId: string): Observable<GameGroupResponse> {
    
    return this.http.patch<GameGroupResponse>(
      `${this.baseUrl}${this.basePath}/${groupId}/participants/${userId}/status`,
      null,
    );
  }

  
  getParticipantId(groupId: string, userId: string): Observable<string | null> {
    const params = new HttpParams()
      .set('gameGroupId', groupId)
      .set('userId', userId);
    type ParticipantListItem = { id: string };
    type ParticipantListResponse = BaseResponse<{ content: ParticipantListItem[] }> | { content: ParticipantListItem[] };
    return this.http.get<ParticipantListResponse>(
      `${this.baseUrl}/api/v1/game-group-participants`,
      { params }
    ).pipe(
      map((resp) => {
        const wrapper = resp as BaseResponse<{ content: ParticipantListItem[] }>;
        const content = wrapper?.data?.content ?? (resp as { content?: ParticipantListItem[] })?.content ?? [];
        return content && content.length > 0 ? content[0].id : null;
      })
    );
  }

  
  deactivateParticipantById(groupId: string, participantId: string): Observable<GameGroupResponse> {
    return this.http.patch<GameGroupResponse>(
      `${this.baseUrl}${this.basePath}/${groupId}/participants/${participantId}/status`,
      null,
    );
  }
}
