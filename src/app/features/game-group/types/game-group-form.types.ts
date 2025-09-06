export type GameGroupFormData = {
  campaignName: string;
  shortDescription: string;
  campaignOverview?: string;
  gameSystem: string;
  settingWorld: string;
  minPlayers: number;
  maxPlayers: number;
  local: string;
  
  visibilityGameGroup: 'public' | 'private';
  accessRule: 'free' | 'friends' | 'approval';
  modality: 'online' | 'presential';
  locationOrVirtualTabletop: string;
  country?: string;
  state?: string;
  city?: string;
  
  
  conduct: string;
  punctualityAttendance: string;
  houseRole: string;
  behavioralExpectations: string;
  commitment: boolean;
};