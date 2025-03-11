
import { Game, GameStats, PlayHighlight, LiveGameUpdate, Team } from "@/types/gameTypes";

// URL base da API oficial da NBA
const NBA_API_BASE_URL = "https://cdn.nba.com/static/json/liveData";
const RAPID_API_BASE_URL = "https://api-nba-v1.p.rapidapi.com";

// Headers necessários para acessar a RapidAPI
const HEADERS = {
  'X-RapidAPI-Key': 'your-api-key-here', // Placeholder - será substituído pelo usuário
  'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
};

// Cache para evitar requisições repetidas
let gamesCache: { [date: string]: Game[] } = {};
let statsCache: { [gameId: number]: GameStats } = {};
let highlightsCache: { [gameId: number]: PlayHighlight[] } = {};
let liveUpdatesCache: { [gameId: number]: LiveGameUpdate[] } = {};
let teamsCache: Team[] = [];

const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Converter o formato de time da API para o nosso formato interno
const mapAPITeamToTeam = (apiTeam: any): Team => {
  return {
    id: apiTeam.teamId || apiTeam.id,
    name: apiTeam.fullName || apiTeam.name,
    abbreviation: apiTeam.triCode || apiTeam.code,
    record: apiTeam.win && apiTeam.loss ? `${apiTeam.win}-${apiTeam.loss}` : "0-0"
  };
};

// Buscar todos os times da NBA
export const fetchTeams = async (): Promise<Team[]> => {
  if (teamsCache.length > 0) {
    return teamsCache;
  }

  try {
    const response = await fetch(`${RAPID_API_BASE_URL}/teams?league=standard`, {
      headers: HEADERS
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar times');
    }
    
    const data = await response.json();
    
    // Filtrar apenas times da NBA
    const nbaTeams = data.response.filter((team: any) => team.nbaFranchise);
    
    teamsCache = nbaTeams.map((team: any) => ({
      id: team.id,
      name: team.name,
      abbreviation: team.code,
      record: "0-0" // Será atualizado posteriormente
    }));
    
    return teamsCache;
  } catch (error) {
    console.error('Erro ao buscar times:', error);
    // Retornar times da simulação em caso de erro
    return generateTeams();
  }
};

// Buscar jogos por data
export const fetchGamesByDate = async (date: Date): Promise<Game[]> => {
  const dateStr = formatDateForAPI(date);
  
  if (gamesCache[dateStr]) {
    return gamesCache[dateStr];
  }
  
  try {
    const response = await fetch(`${RAPID_API_BASE_URL}/games?date=${dateStr}`, {
      headers: HEADERS
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar jogos');
    }
    
    const data = await response.json();
    
    // Mapear dados da API para nosso formato interno
    const games: Game[] = data.response.map((game: any) => {
      const homeTeam = mapAPITeamToTeam(game.teams.home);
      const awayTeam = mapAPITeamToTeam(game.teams.visitors);
      
      return {
        id: game.id,
        date: new Date(game.date.start),
        homeTeam,
        awayTeam,
        homeScore: game.scores.home.points || 0,
        awayScore: game.scores.visitors.points || 0,
        status: mapGameStatus(game.status.long),
        currentPeriod: game.periods.current > 0 ? `Q${game.periods.current} ${game.status.clock || ''}` : undefined,
        arena: game.arena.name,
        location: `${game.arena.city}, ${game.arena.state}`
      };
    });
    
    gamesCache[dateStr] = games;
    return games;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    
    // Usar generateGames do arquivo gameData.ts em caso de erro ou limite de API
    return import('@/data/gameData').then(module => {
      const games = module.generateGames(date, 5);
      gamesCache[dateStr] = games;
      return games;
    });
  }
};

// Buscar jogos ao vivo
export const fetchLiveGames = async (): Promise<Game[]> => {
  try {
    const response = await fetch(`${NBA_API_BASE_URL}/scoreboard.json`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar jogos ao vivo');
    }
    
    const data = await response.json();
    
    const games: Game[] = data.scoreboard.games.map((game: any) => {
      const homeTeam: Team = {
        id: game.homeTeam.teamId,
        name: game.homeTeam.teamName,
        abbreviation: game.homeTeam.teamTricode,
        record: `${game.homeTeam.wins}-${game.homeTeam.losses}`
      };
      
      const awayTeam: Team = {
        id: game.awayTeam.teamId,
        name: game.awayTeam.teamName,
        abbreviation: game.awayTeam.teamTricode,
        record: `${game.awayTeam.wins}-${game.awayTeam.losses}`
      };
      
      return {
        id: game.gameId,
        date: new Date(game.gameTimeUTC),
        homeTeam,
        awayTeam,
        homeScore: game.homeTeam.score,
        awayScore: game.awayTeam.score,
        status: game.gameStatus === 2 ? 'live' : (game.gameStatus === 3 ? 'completed' : 'scheduled'),
        currentPeriod: game.gameStatusText,
        arena: game.arena.arenaName,
        location: `${game.arena.arenaCity}, ${game.arena.arenaState}`
      };
    });
    
    // Atualizar o cache com os jogos ao vivo
    const today = formatDateForAPI(new Date());
    if (games.length > 0) {
      gamesCache[today] = games;
    }
    
    return games.filter(game => game.status === 'live');
  } catch (error) {
    console.error('Erro ao buscar jogos ao vivo:', error);
    
    // Usar dados simulados em caso de erro
    return import('@/data/gameData').then(module => {
      const allGames = module.generateGames(new Date(), 10);
      return allGames.filter(game => game.status === 'live');
    });
  }
};

// Buscar estatísticas de um jogo específico
export const fetchGameStats = async (gameId: number): Promise<GameStats> => {
  if (statsCache[gameId]) {
    return statsCache[gameId];
  }
  
  try {
    const response = await fetch(`${NBA_API_BASE_URL}/boxscore/${gameId}.json`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar estatísticas do jogo');
    }
    
    const data = await response.json();
    const boxscore = data.game;
    
    const homeStats = boxscore.homeTeam;
    const awayStats = boxscore.awayTeam;
    
    const gameStats: GameStats = {
      gameId,
      homeTeam: {
        id: homeStats.teamId,
        name: homeStats.teamName,
        abbreviation: homeStats.teamTricode,
        record: `${homeStats.wins}-${homeStats.losses}`,
        points: homeStats.score,
        rebounds: homeStats.reboundsTotal,
        assists: homeStats.assists,
        steals: homeStats.steals,
        blocks: homeStats.blocks,
        turnovers: homeStats.turnovers,
        fieldGoalsMade: homeStats.fieldGoalsMade,
        fieldGoalsAttempted: homeStats.fieldGoalsAttempted,
        threePointsMade: homeStats.threePointersMade,
        threePointsAttempted: homeStats.threePointersAttempted,
        freeThrowsMade: homeStats.freeThrowsMade,
        freeThrowsAttempted: homeStats.freeThrowsAttempted
      },
      awayTeam: {
        id: awayStats.teamId,
        name: awayStats.teamName,
        abbreviation: awayStats.teamTricode,
        record: `${awayStats.wins}-${awayStats.losses}`,
        points: awayStats.score,
        rebounds: awayStats.reboundsTotal,
        assists: awayStats.assists,
        steals: awayStats.steals,
        blocks: awayStats.blocks,
        turnovers: awayStats.turnovers,
        fieldGoalsMade: awayStats.fieldGoalsMade,
        fieldGoalsAttempted: awayStats.fieldGoalsAttempted,
        threePointsMade: awayStats.threePointersMade,
        threePointsAttempted: awayStats.threePointersAttempted,
        freeThrowsMade: awayStats.freeThrowsMade,
        freeThrowsAttempted: awayStats.freeThrowsAttempted
      }
    };
    
    statsCache[gameId] = gameStats;
    return gameStats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas do jogo:', error);
    
    // Usar dados simulados em caso de erro
    return import('@/data/gameStatsData').then(module => {
      const stats = module.generateGameStats();
      statsCache[gameId] = stats;
      return stats;
    });
  }
};

// Buscar atualizações em tempo real de um jogo específico
export const fetchLiveGameUpdates = async (gameId: number): Promise<LiveGameUpdate[]> => {
  try {
    const response = await fetch(`${NBA_API_BASE_URL}/playbyplay/${gameId}.json`);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar atualizações do jogo');
    }
    
    const data = await response.json();
    const actions = data.game.actions.slice(-10); // Últimas 10 ações
    
    const updates: LiveGameUpdate[] = actions.map((action: any) => {
      return {
        gameId,
        timestamp: action.timeActual,
        action: action.actionType,
        description: action.description,
        score: {
          home: action.scoreHome,
          away: action.scoreAway
        },
        period: `Q${action.period}`,
        timeRemaining: action.clock
      };
    });
    
    liveUpdatesCache[gameId] = updates;
    return updates;
  } catch (error) {
    console.error('Erro ao buscar atualizações do jogo:', error);
    
    // Usar dados simulados em caso de erro
    return import('@/data/highlightsData').then(module => {
      const updates = module.generateLiveUpdates(gameId, 10);
      liveUpdatesCache[gameId] = updates;
      return updates;
    });
  }
};

// Buscar highlights de um jogo específico
export const fetchGameHighlights = async (gameId: number): Promise<PlayHighlight[]> => {
  if (highlightsCache[gameId]) {
    return highlightsCache[gameId];
  }
  
  try {
    // Esta rota não existe na API pública, mas estamos adicionando como exemplo
    const response = await fetch(`${RAPID_API_BASE_URL}/games/highlights?id=${gameId}`, {
      headers: HEADERS
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar highlights do jogo');
    }
    
    const data = await response.json();
    
    const highlights: PlayHighlight[] = data.response.map((highlight: any, index: number) => {
      return {
        id: gameId * 100 + index,
        gameId,
        title: highlight.title,
        description: highlight.description,
        videoUrl: highlight.videoUrl,
        thumbnailUrl: highlight.thumbnailUrl,
        timestamp: highlight.timestamp,
        player: highlight.player ? {
          id: highlight.player.id,
          name: highlight.player.name,
          team: highlight.player.team
        } : undefined
      };
    });
    
    highlightsCache[gameId] = highlights;
    return highlights;
  } catch (error) {
    console.error('Erro ao buscar highlights do jogo:', error);
    
    // Usar dados simulados em caso de erro
    return import('@/data/highlightsData').then(module => {
      const highlights = module.generateHighlights(gameId, 4);
      highlightsCache[gameId] = highlights;
      return highlights;
    });
  }
};

// Mapear status do jogo da API para nosso formato interno
const mapGameStatus = (status: string): 'scheduled' | 'live' | 'completed' => {
  if (status.includes('In Play') || status.includes('AO VIVO')) {
    return 'live';
  } else if (status.includes('Finished') || status.includes('Final')) {
    return 'completed';
  } else {
    return 'scheduled';
  }
};

// Função auxiliar para gerar times em caso de falha na API
const generateTeams = (): Team[] => {
  return [
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
};
