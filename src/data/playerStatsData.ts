
import { Player } from "@/types/playerTypes";

const randomBetween = (min: number, max: number, decimals: number = 1): number => {
  const value = Math.random() * (max - min) + min;
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

export const generateTopPlayers = (): Player[] => {
  const players: Player[] = [
    {
      id: 1,
      name: 'LeBron James',
      position: 'SF',
      team: { id: 1610612747, name: 'Los Angeles Lakers', abbreviation: 'LAL' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/2544.png',
      stats: {
        ppg: randomBetween(25, 30),
        rpg: randomBetween(7, 9),
        apg: randomBetween(7, 10),
        spg: randomBetween(1, 1.8),
        bpg: randomBetween(0.5, 1.2),
        fgp: randomBetween(50, 55),
        tpp: randomBetween(35, 40),
        ftp: randomBetween(70, 80)
      }
    },
    {
      id: 2,
      name: 'Stephen Curry',
      position: 'PG',
      team: { id: 1610612744, name: 'Golden State Warriors', abbreviation: 'GSW' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/201939.png',
      stats: {
        ppg: randomBetween(26, 32),
        rpg: randomBetween(4, 6),
        apg: randomBetween(5, 7),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(0.2, 0.5),
        fgp: randomBetween(45, 50),
        tpp: randomBetween(40, 45),
        ftp: randomBetween(90, 95)
      }
    },
    {
      id: 3,
      name: 'Giannis Antetokounmpo',
      position: 'PF',
      team: { id: 1610612749, name: 'Milwaukee Bucks', abbreviation: 'MIL' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/203507.png',
      stats: {
        ppg: randomBetween(28, 33),
        rpg: randomBetween(11, 14),
        apg: randomBetween(5, 7),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(1, 2),
        fgp: randomBetween(55, 62),
        tpp: randomBetween(25, 32),
        ftp: randomBetween(65, 75)
      }
    },
    {
      id: 4,
      name: 'Nikola Jokić',
      position: 'C',
      team: { id: 1610612743, name: 'Denver Nuggets', abbreviation: 'DEN' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/203999.png',
      stats: {
        ppg: randomBetween(25, 29),
        rpg: randomBetween(11, 13),
        apg: randomBetween(8, 10),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(0.5, 1),
        fgp: randomBetween(55, 60),
        tpp: randomBetween(32, 38),
        ftp: randomBetween(80, 85)
      }
    },
    {
      id: 5,
      name: 'Kevin Durant',
      position: 'SF',
      team: { id: 1610612756, name: 'Phoenix Suns', abbreviation: 'PHX' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/201142.png',
      stats: {
        ppg: randomBetween(27, 32),
        rpg: randomBetween(6, 8),
        apg: randomBetween(4, 6),
        spg: randomBetween(0.5, 1),
        bpg: randomBetween(1, 1.8),
        fgp: randomBetween(50, 55),
        tpp: randomBetween(38, 42),
        ftp: randomBetween(88, 92)
      }
    },
    {
      id: 6,
      name: 'Jayson Tatum',
      position: 'SF',
      team: { id: 1610612738, name: 'Boston Celtics', abbreviation: 'BOS' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1628369.png',
      stats: {
        ppg: randomBetween(27, 31),
        rpg: randomBetween(8, 10),
        apg: randomBetween(4, 6),
        spg: randomBetween(0.8, 1.2),
        bpg: randomBetween(0.5, 1),
        fgp: randomBetween(45, 50),
        tpp: randomBetween(35, 40),
        ftp: randomBetween(80, 85)
      }
    },
    {
      id: 7,
      name: 'Joel Embiid',
      position: 'C',
      team: { id: 1610612755, name: 'Philadelphia 76ers', abbreviation: 'PHI' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/203954.png',
      stats: {
        ppg: randomBetween(30, 35),
        rpg: randomBetween(10, 13),
        apg: randomBetween(4, 6),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(1.5, 2.2),
        fgp: randomBetween(50, 55),
        tpp: randomBetween(30, 36),
        ftp: randomBetween(82, 88)
      }
    },
    {
      id: 8,
      name: 'Luka Dončić',
      position: 'PG',
      team: { id: 1610612742, name: 'Dallas Mavericks', abbreviation: 'DAL' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1629029.png',
      stats: {
        ppg: randomBetween(32, 36),
        rpg: randomBetween(8, 10),
        apg: randomBetween(8, 10),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(0.3, 0.7),
        fgp: randomBetween(45, 50),
        tpp: randomBetween(35, 40),
        ftp: randomBetween(75, 82)
      }
    },
    {
      id: 9,
      name: 'Anthony Davis',
      position: 'PF',
      team: { id: 1610612747, name: 'Los Angeles Lakers', abbreviation: 'LAL' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/203076.png',
      stats: {
        ppg: randomBetween(24, 28),
        rpg: randomBetween(11, 14),
        apg: randomBetween(2, 4),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(2, 3),
        fgp: randomBetween(52, 58),
        tpp: randomBetween(25, 32),
        ftp: randomBetween(75, 82)
      }
    },
    {
      id: 10,
      name: 'Kawhi Leonard',
      position: 'SF',
      team: { id: 1610612746, name: 'Los Angeles Clippers', abbreviation: 'LAC' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/202695.png',
      stats: {
        ppg: randomBetween(24, 28),
        rpg: randomBetween(6, 8),
        apg: randomBetween(3, 5),
        spg: randomBetween(1.5, 2),
        bpg: randomBetween(0.5, 1),
        fgp: randomBetween(48, 52),
        tpp: randomBetween(38, 42),
        ftp: randomBetween(85, 90)
      }
    },
    {
      id: 11,
      name: 'Ja Morant',
      position: 'PG',
      team: { id: 1610612763, name: 'Memphis Grizzlies', abbreviation: 'MEM' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1629630.png',
      stats: {
        ppg: randomBetween(25, 30),
        rpg: randomBetween(5, 7),
        apg: randomBetween(7, 9),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(0.3, 0.6),
        fgp: randomBetween(45, 50),
        tpp: randomBetween(30, 35),
        ftp: randomBetween(75, 82)
      }
    },
    {
      id: 12,
      name: 'Damian Lillard',
      position: 'PG',
      team: { id: 1610612749, name: 'Milwaukee Bucks', abbreviation: 'MIL' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/203081.png',
      stats: {
        ppg: randomBetween(27, 32),
        rpg: randomBetween(4, 6),
        apg: randomBetween(6, 8),
        spg: randomBetween(0.8, 1.2),
        bpg: randomBetween(0.2, 0.5),
        fgp: randomBetween(43, 48),
        tpp: randomBetween(36, 40),
        ftp: randomBetween(90, 95)
      }
    },
    {
      id: 13,
      name: 'Trae Young',
      position: 'PG',
      team: { id: 1610612737, name: 'Atlanta Hawks', abbreviation: 'ATL' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1629027.png',
      stats: {
        ppg: randomBetween(26, 30),
        rpg: randomBetween(2, 4),
        apg: randomBetween(9, 12),
        spg: randomBetween(0.8, 1.2),
        bpg: randomBetween(0.1, 0.3),
        fgp: randomBetween(42, 47),
        tpp: randomBetween(35, 40),
        ftp: randomBetween(85, 90)
      }
    },
    {
      id: 14,
      name: 'Devin Booker',
      position: 'SG',
      team: { id: 1610612756, name: 'Phoenix Suns', abbreviation: 'PHX' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1626164.png',
      stats: {
        ppg: randomBetween(27, 31),
        rpg: randomBetween(4, 6),
        apg: randomBetween(5, 7),
        spg: randomBetween(0.8, 1.2),
        bpg: randomBetween(0.2, 0.5),
        fgp: randomBetween(45, 50),
        tpp: randomBetween(35, 40),
        ftp: randomBetween(85, 90)
      }
    },
    {
      id: 15,
      name: 'Victor Wembanyama',
      position: 'PF',
      team: { id: 1610612759, name: 'San Antonio Spurs', abbreviation: 'SAS' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1641705.png',
      stats: {
        ppg: randomBetween(20, 25),
        rpg: randomBetween(10, 12),
        apg: randomBetween(3, 5),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(3, 4),
        fgp: randomBetween(45, 50),
        tpp: randomBetween(30, 35),
        ftp: randomBetween(75, 80)
      }
    },
    {
      id: 16,
      name: 'Shai Gilgeous-Alexander',
      position: 'SG',
      team: { id: 1610612760, name: 'Oklahoma City Thunder', abbreviation: 'OKC' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1628983.png',
      stats: {
        ppg: randomBetween(30, 33),
        rpg: randomBetween(5, 7),
        apg: randomBetween(5, 7),
        spg: randomBetween(1.5, 2),
        bpg: randomBetween(0.8, 1.2),
        fgp: randomBetween(50, 55),
        tpp: randomBetween(35, 40),
        ftp: randomBetween(85, 90)
      }
    },
    {
      id: 17,
      name: 'Anthony Edwards',
      position: 'SG',
      team: { id: 1610612750, name: 'Minnesota Timberwolves', abbreviation: 'MIN' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1630162.png',
      stats: {
        ppg: randomBetween(25, 29),
        rpg: randomBetween(5, 7),
        apg: randomBetween(4, 6),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(0.5, 1),
        fgp: randomBetween(45, 50),
        tpp: randomBetween(35, 40),
        ftp: randomBetween(80, 85)
      }
    },
    {
      id: 18,
      name: 'Jaylen Brown',
      position: 'SG',
      team: { id: 1610612738, name: 'Boston Celtics', abbreviation: 'BOS' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1627759.png',
      stats: {
        ppg: randomBetween(22, 26),
        rpg: randomBetween(5, 7),
        apg: randomBetween(3, 5),
        spg: randomBetween(1, 1.3),
        bpg: randomBetween(0.3, 0.7),
        fgp: randomBetween(47, 52),
        tpp: randomBetween(35, 40),
        ftp: randomBetween(75, 80)
      }
    },
    {
      id: 19,
      name: 'Zion Williamson',
      position: 'PF',
      team: { id: 1610612740, name: 'New Orleans Pelicans', abbreviation: 'NOP' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1629627.png',
      stats: {
        ppg: randomBetween(25, 29),
        rpg: randomBetween(6, 8),
        apg: randomBetween(4, 6),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(0.5, 1),
        fgp: randomBetween(58, 65),
        tpp: randomBetween(25, 35),
        ftp: randomBetween(65, 75)
      }
    },
    {
      id: 20,
      name: 'Bam Adebayo',
      position: 'C',
      team: { id: 1610612748, name: 'Miami Heat', abbreviation: 'MIA' },
      imageUrl: 'https://cdn.nba.com/headshots/nba/latest/260x190/1628389.png',
      stats: {
        ppg: randomBetween(18, 22),
        rpg: randomBetween(9, 11),
        apg: randomBetween(3, 5),
        spg: randomBetween(1, 1.5),
        bpg: randomBetween(0.8, 1.2),
        fgp: randomBetween(50, 55),
        tpp: randomBetween(15, 25),
        ftp: randomBetween(75, 80)
      }
    },
  ];
  
  return players;
};
