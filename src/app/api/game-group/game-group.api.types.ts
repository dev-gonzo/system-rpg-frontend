import { PageInfo } from '@app/core/types/pageInfo';
import { BaseResponse, HateoasLink } from '../../core/types';

export interface GameGroupCreateRequest {
  campaignName: string;
  gameSystem: string;
  settingWorld?: string;
  shortDescription: string;
  description?: string;
  minPlayers?: number;
  maxPlayers?: number;

  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  accessRule: 'FREE' | 'FRIENDS' | 'APPROVAL';
  modality: 'ONLINE' | 'PRESENCIAL';
  country?: string;
  state?: string;
  city?: string;

  themesContent?: string;
  punctualityAttendance?: string;
  houseRules?: string;
  behavioralExpectations?: string;
}

export interface GameGroupMember {
  id: string;
  username: string;
  role: 'MASTER' | 'PLAYER';
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameGroupCreatedBy {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  passwordChangedAt: string;
  roles: UserRole[];
}

export interface GameGroupResponseData {
  id: string;

  campaignName: string;
  description?: string;
  gameSystem: string;
  settingWorld?: string;

  accessRule: string;
  modality: string;

  maxPlayers?: number;
  currentParticipants?: number;
  location?: string;
  rules?: string;
  notes?: string;

  
  shortDescription: string;
  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  minPlayers?: number;
  participants?: GameGroupMember[];
  country?: string;
  state?: string;
  city?: string;
  themesContent?: string;
  punctualityAttendance?: string;
  houseRules?: string;
  behavioralExpectations?: string;

  createdBy: GameGroupCreatedBy;
  isActive: boolean;

  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  _links?: HateoasLink[];
}

export interface GameGroupMyGroupsResponseData {
  content: GameGroupResponseData[];
  _links: HateoasLink[];
  page: PageInfo;
}


export type GameGroupResponse = BaseResponse<GameGroupResponseData>;
export type GameGroupMyGroupsResponse = BaseResponse<GameGroupMyGroupsResponseData>;
