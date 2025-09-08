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

export interface GameGroupResponseData {
  id: string;

  campaignName: string;
  shortDescription: string;
  gameSystem: string;
  settingWorld?: string;

  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  accessRule: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  modality: 'ONLINE' | 'PRESENTIAL';

  minPlayers?: number;
  maxPlayers?: number;
  currentParticipants?: number;
  participants?: GameGroupMember[];

  country?: string;
  state?: string;
  city?: string;

  themesContent?: string;
  punctualityAttendance?: string;
  houseRules?: string;
  behavioralExpectations?: string;

  createdBy?: string;
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
