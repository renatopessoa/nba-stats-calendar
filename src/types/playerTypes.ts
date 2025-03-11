
export interface PlayerTeam {
  id: number;
  name: string;
  abbreviation: string;
}

export interface PlayerStats {
  ppg: number; // points per game
  rpg: number; // rebounds per game
  apg: number; // assists per game
  spg: number; // steals per game
  bpg: number; // blocks per game
  fgp: number; // field goal percentage
  tpp: number; // three point percentage
  ftp: number; // free throw percentage
}

export interface Player {
  id: number;
  name: string;
  position: string;
  team: PlayerTeam;
  imageUrl: string;
  stats: PlayerStats;
}
