
export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  record: string;
}

export interface Game {
  id: number;
  date: Date;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'completed';
  currentPeriod?: string;
  arena: string;
  location: string;
}

export interface GameStats {
  gameId: number;
  homeTeam: TeamStats;
  awayTeam: TeamStats;
}

export interface TeamStats {
  id: number;
  name: string;
  abbreviation: string;
  record: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointsMade: number;
  threePointsAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
}

export interface PlayHighlight {
  id: number;
  gameId: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  timestamp: string;
  player?: {
    id: number;
    name: string;
    team: string;
  };
}

export interface LiveGameUpdate {
  gameId: number;
  timestamp: string;
  action: string;
  description: string;
  score: {
    home: number;
    away: number;
  };
  period: string;
  timeRemaining: string;
}
