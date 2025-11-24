import { BaseResponse, HateoasLink } from '../../core/types';

export interface AdventureNoteCreateRequest {
  title: string;
  content: string;
}

export interface AdventureNoteUpdateRequest {
  title?: string;
  content?: string;
}

export interface AdventureNoteResponseData {
  id: string;
  adventureId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  _links?: HateoasLink[];
}

export type AdventureNoteResponse = BaseResponse<AdventureNoteResponseData>;
export type AdventureNoteListResponse = BaseResponse<AdventureNoteResponseData[]>;