
export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  conference: 'east' | 'west';
  wins: number;
  losses: number;
  gamesBehind: number;
  homeRecord: string;
  awayRecord: string;
  lastTenRecord: string;
  streak: string;
}
