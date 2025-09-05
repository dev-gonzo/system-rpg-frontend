import { BaseResponse, Role } from '../../core/types';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface RegisterResponseData {
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
  passwordChangedAt: string;
}

export type RegisterResponse = BaseResponse<RegisterResponseData>;

export interface CheckAvailabilityData {
  available: boolean;
}

export type CheckAvailabilityResponse = BaseResponse<CheckAvailabilityData>;
