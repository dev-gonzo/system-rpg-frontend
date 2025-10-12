import { BaseResponse, HateoasLink } from '../../core/types';

export interface AdventureCreateRequest {
  title: string;
  description: string;
}

export interface AdventureUpdateRequest {
  title?: string;
  description?: string;
  isActive?: boolean;
}

export interface AdventureResponseData {
  id: string;
  gameGroupId: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  _links?: HateoasLink[];
}

export type AdventureResponse = BaseResponse<AdventureResponseData>;
export type AdventureListResponse = BaseResponse<AdventureResponseData[]>;