
import { addHours, setHours, setMinutes } from 'date-fns';
import { Game, Team } from '@/types/gameTypes';

const NBA_TEAMS: Team[] = [
  { id: 1610612737, name: 'Atlanta Hawks', abbreviation: 'ATL', record: '36-46' },
  { id: 1610612738, name: 'Boston Celtics', abbreviation: 'BOS', record: '64-18' },
  { id: 1610612751, name: 'Brooklyn Nets', abbreviation: 'BKN', record: '32-50' },
  { id: 1610612766, name: 'Charlotte Hornets', abbreviation: 'CHA', record: '21-61' },
  { id: 1610612741, name: 'Chicago Bulls', abbreviation: 'CHI', record: '39-43' },
  { id: 1610612739, name: 'Cleveland Cavaliers', abbreviation: 'CLE', record: '48-34' },
  { id: 1610612742, name: 'Dallas Mavericks', abbreviation: 'DAL', record: '50-32' },
  { id: 1610612743, name: 'Denver Nuggets', abbreviation: 'DEN', record: '57-25' },
  { id: 1610612765, name: 'Detroit Pistons', abbreviation: 'DET', record: '14-68' },
  { id: 1610612744, name: 'Golden State Warriors', abbreviation: 'GSW', record: '46-36' },
  { id: 1610612745, name: 'Houston Rockets', abbreviation: 'HOU', record: '41-41' },
  { id: 1610612754, name: 'Indiana Pacers', abbreviation: 'IND', record: '47-35' },
  { id: 1610612746, name: 'Los Angeles Clippers', abbreviation: 'LAC', record: '51-31' },
  { id: 1610612747, name: 'Los Angeles Lakers', abbreviation: 'LAL', record: '47-35' },
  { id: 1610612763, name: 'Memphis Grizzlies', abbreviation: 'MEM', record: '27-55' },
  { id: 1610612748, name: 'Miami Heat', abbreviation: 'MIA', record: '46-36' },
  { id: 1610612749, name: 'Milwaukee Bucks', abbreviation: 'MIL', record: '49-33' },
  { id: 1610612750, name: 'Minnesota Timberwolves', abbreviation: 'MIN', record: '56-26' },
  { id: 1610612740, name: 'New Orleans Pelicans', abbreviation: 'NOP', record: '49-33' },
  { id: 1610612752, name: 'New York Knicks', abbreviation: 'NYK', record: '50-32' },
  { id: 1610612760, name: 'Oklahoma City Thunder', abbreviation: 'OKC', record: '57-25' },
  { id: 1610612753, name: 'Orlando Magic', abbreviation: 'ORL', record: '47-35' },
  { id: 1610612755, name: 'Philadelphia 76ers', abbreviation: 'PHI', record: '47-35' },
  { id: 1610612756, name: 'Phoenix Suns', abbreviation: 'PHX', record: '49-33' },
  { id: 1610612757, name: 'Portland Trail Blazers', abbreviation: 'POR', record: '21-61' },
  { id: 1610612758, name: 'Sacramento Kings', abbreviation: 'SAC', record: '46-36' },
  { id: 1610612759, name: 'San Antonio Spurs', abbreviation: 'SAS', record: '22-60' },
  { id: 1610612761, name: 'Toronto Raptors', abbreviation: 'TOR', record: '25-57' },
  { id: 1610612762, name: 'Utah Jazz', abbreviation: 'UTA', record: '31-51' },
  { id: 1610612764, name: 'Washington Wizards', abbreviation: 'WAS', record: '15-67' },
];

const ARENAS: { [key: string]: string } = {
  'ATL': 'State Farm Arena, Atlanta',
  'BOS': 'TD Garden, Boston',
  'BKN': 'Barclays Center, Brooklyn',
  'CHA': 'Spectrum Center, Charlotte',
  'CHI': 'United Center, Chicago',
  'CLE': 'Rocket Mortgage FieldHouse, Cleveland',
  'DAL': 'American Airlines Center, Dallas',
  'DEN': 'Ball Arena, Denver',
  'DET': 'Little Caesars Arena, Detroit',
  'GSW': 'Chase Center, San Francisco',
  'HOU': 'Toyota Center, Houston',
  'IND': 'Gainbridge Fieldhouse, Indianapolis',
  'LAC': 'Intuit Dome, Los Angeles',
  'LAL': 'Crypto.com Arena, Los Angeles',
  'MEM': 'FedExForum, Memphis',
  'MIA': 'Kaseya Center, Miami',
  'MIL': 'Fiserv Forum, Milwaukee',
  'MIN': 'Target Center, Minneapolis',
  'NOP': 'Smoothie King Center, New Orleans',
  'NYK': 'Madison Square Garden, New York',
  'OKC': 'Paycom Center, Oklahoma City',
  'ORL': 'Kia Center, Orlando',
  'PHI': 'Wells Fargo Center, Philadelphia',
  'PHX': 'Footprint Center, Phoenix',
  'POR': 'Moda Center, Portland',
  'SAC': 'Golden 1 Center, Sacramento',
  'SAS': 'Frost Bank Center, San Antonio',
  'TOR': 'Scotiabank Arena, Toronto',
  'UTA': 'Delta Center, Salt Lake City',
  'WAS': 'Capital One Arena, Washington',
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateGames = (date: Date, count: number): Game[] => {
  const shuffledTeams = shuffleArray(NBA_TEAMS);
  const games: Game[] = [];
  
  for (let i = 0; i < count; i++) {
    const homeTeam = shuffledTeams[i * 2];
    const awayTeam = shuffledTeams[i * 2 + 1];
    
    if (!homeTeam || !awayTeam) continue;
    
    // Random game time
    const gameDate = new Date(date);
    setHours(gameDate, 17 + Math.floor(Math.random() * 6)); // Game time between 5pm and 10pm
    setMinutes(gameDate, Math.random() > 0.5 ? 0 : 30); // Either on the hour or half past

    // Determine game status based on time
    const now = new Date();
    let status: 'scheduled' | 'live' | 'completed' = 'scheduled';
    let homeScore = 0;
    let awayScore = 0;
    let currentPeriod = undefined;
    
    if (gameDate < now) {
      // Game in the past
      status = 'completed';
      homeScore = 85 + Math.floor(Math.random() * 40);
      awayScore = 85 + Math.floor(Math.random() * 40);
    } else if (Math.random() > 0.8) {
      // Some games in progress
      status = 'live';
      homeScore = 40 + Math.floor(Math.random() * 60);
      awayScore = 40 + Math.floor(Math.random() * 60);
      
      const periods = ['Q1', 'Q2', 'Q3', 'Q4', 'OT'];
      const times = ['12:00', '08:24', '04:45', '01:15', '00:35'];
      const periodIndex = Math.floor(Math.random() * periods.length);
      currentPeriod = `${periods[periodIndex]} ${times[Math.floor(Math.random() * times.length)]}`;
    }
    
    games.push({
      id: 1000000 + i,
      date: gameDate,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      status,
      currentPeriod,
      arena: ARENAS[homeTeam.abbreviation],
      location: ARENAS[homeTeam.abbreviation].split(', ')[1],
    });
  }
  
  return games;
};
