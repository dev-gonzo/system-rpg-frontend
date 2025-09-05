import { BaseResponse, Role } from '../../core/types';
import { HateoasLink } from '../../core/types/hateoas';

export interface UserSearchParams {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  passwordChangedAt: string;
  _links: HateoasLink[];
}

export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  numberOfElements: number;
}

export interface UserSearchResponseData {
  content: UserData[];
  _links: HateoasLink[];
  page: PageInfo;
}

export type UserSearchResponse = BaseResponse<UserSearchResponseData>;

export interface UserActionRequest {
  userId: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export type UserCreateResponse = BaseResponse<UserData>;
export type UserGetByIdResponse = BaseResponse<UserData>;
export type UserUpdateResponse = BaseResponse<UserData>;
export type UserDeleteResponse = BaseResponse<null>;
export type UserToggleStatusResponse = BaseResponse<UserData>;
export type UserVerifyEmailResponse = BaseResponse<UserData>;