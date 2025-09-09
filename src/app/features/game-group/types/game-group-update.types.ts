
export interface GameGroupUpdateRequest {
  
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

  
  country?: string;

  
  state?: string;

  
  city?: string;

  
  themesContent?: string;

  
  punctualityAttendance?: string;

  
  houseRules?: string;

  
  behavioralExpectations?: string;
}


export enum GameGroupVisibility {
  PUBLIC = 'PUBLIC',
  FRIENDS = 'FRIENDS',
  PRIVATE = 'PRIVATE'
}

export enum GameGroupAccessRule {
  FREE = 'FREE',
  FRIENDS = 'FRIENDS',
  APPROVAL = 'APPROVAL'
}

export enum GameGroupModality {
  ONLINE = 'ONLINE',
  PRESENCIAL = 'PRESENCIAL'
}


export type GameGroupPartialUpdate = Partial<GameGroupUpdateRequest>;