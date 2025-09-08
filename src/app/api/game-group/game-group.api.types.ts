import { BaseResponse } from '../../core/types';

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

export interface GameGroupResponseData {
  id: string;

  campaignName: string;
  description?: string;
  gameSystem: string;
  settingWorld?: string;
  shortDescription: string;

  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  accessRule: 'FREE' | 'FRIENDS' | 'APPROVAL';
  modality: 'ONLINE' | 'PRESENCIAL';

  minPlayers?: number;
  maxPlayers?: number;
  currentParticipants?: number;

  country?: string;
  state?: string;
  city?: string;

  themesContent?: string;
  punctualityAttendance?: string;
  houseRules?: string;
  behavioralExpectations?: string;

  createdBy: string;
  isActive: boolean;

  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type GameGroupResponse = BaseResponse<GameGroupResponseData>;
