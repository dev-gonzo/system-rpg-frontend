import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '@app/core/tokens/api-base-url.token';
import {
  AdventureNoteCreateRequest,
  AdventureNoteUpdateRequest,
  AdventureNoteResponse,
  AdventureNoteListResponse,
} from './adventure-note.api.types';

@Injectable({ providedIn: 'root' })
export class AdventureNoteApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_URL);
  private readonly basePath = '/api/v1/adventures';

  listByAdventure(adventureId: string): Observable<AdventureNoteListResponse> {
    return this.http.get<AdventureNoteListResponse>(
      `${this.baseUrl}${this.basePath}/${adventureId}/notes`,
    );
  }

  getById(_adventureId: string, noteId: string): Observable<AdventureNoteResponse> {
    return this.http.get<AdventureNoteResponse>(
      `${this.baseUrl}/api/v1/adventures/notes/${noteId}`,
    );
  }

  create(adventureId: string, data: AdventureNoteCreateRequest): Observable<AdventureNoteResponse> {
    return this.http.post<AdventureNoteResponse>(
      `${this.baseUrl}${this.basePath}/${adventureId}/notes`,
      data,
    );
  }

  update(_adventureId: string, noteId: string, data: AdventureNoteUpdateRequest): Observable<AdventureNoteResponse> {
    return this.http.put<AdventureNoteResponse>(
      `${this.baseUrl}/api/v1/adventures/notes/${noteId}`,
      data,
    );
  }

  delete(_adventureId: string, noteId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/v1/adventures/notes/${noteId}`,
    );
  }
}