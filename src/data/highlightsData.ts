
import { PlayHighlight, LiveGameUpdate } from "@/types/gameTypes";

const HIGHLIGHT_ACTIONS = [
  "Enterrada espetacular",
  "Bloqueio monstruoso",
  "Arremesso de três pontos",
  "Passe incrível",
  "Roubo de bola",
  "Contra-ataque veloz",
  "Lance livre decisivo",
  "Jogada pelo garrafão",
  "Assistência no-look",
  "Cesta na última jogada"
];

const PLAYER_NAMES = [
  "LeBron James", "Stephen Curry", "Kevin Durant", "Giannis Antetokounmpo",
  "Luka Dončić", "Nikola Jokić", "Joel Embiid", "Jayson Tatum", "Ja Morant",
  "Damian Lillard", "Anthony Edwards", "Shai Gilgeous-Alexander"
];

const TEAMS = [
  { id: 1610612747, name: "Los Angeles Lakers", abbreviation: "LAL" },
  { id: 1610612744, name: "Golden State Warriors", abbreviation: "GSW" },
  { id: 1610612756, name: "Phoenix Suns", abbreviation: "PHX" },
  { id: 1610612738, name: "Boston Celtics", abbreviation: "BOS" },
  { id: 1610612750, name: "Minnesota Timberwolves", abbreviation: "MIN" },
  { id: 1610612760, name: "Oklahoma City Thunder", abbreviation: "OKC" },
  { id: 1610612748, name: "Miami Heat", abbreviation: "MIA" },
  { id: 1610612755, name: "Philadelphia 76ers", abbreviation: "PHI" }
];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateHighlights = (gameId: number, count: number = 4): PlayHighlight[] => {
  const highlights: PlayHighlight[] = [];
  
  for (let i = 0; i < count; i++) {
    const action = getRandomElement(HIGHLIGHT_ACTIONS);
    const playerName = getRandomElement(PLAYER_NAMES);
    const team = getRandomElement(TEAMS);
    
    // Gerar um ID de jogador fictício baseado no nome
    const playerId = playerName.charCodeAt(0) * 1000 + playerName.length;
    
    highlights.push({
      id: gameId * 100 + i,
      gameId,
      title: `${action} de ${playerName}`,
      description: `${playerName} fez uma ${action.toLowerCase()} incrível representando o ${team.name}.`,
      videoUrl: `https://www.youtube.com/watch?v=MhmyrUjGq9A`, // Link fictício
      thumbnailUrl: `https://picsum.photos/seed/${gameId * 100 + i}/400/225`, // Imagem aleatória
      timestamp: `Q${Math.floor(Math.random() * 4) + 1} ${Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      player: {
        id: playerId,
        name: playerName,
        team: team.abbreviation
      }
    });
  }
  
  return highlights;
};

export const generateLiveUpdates = (gameId: number, count: number = 10): LiveGameUpdate[] => {
  const updates: LiveGameUpdate[] = [];
  let homeScore = 70 + Math.floor(Math.random() * 30);
  let awayScore = 70 + Math.floor(Math.random() * 30);
  const currentPeriod = Math.floor(Math.random() * 4) + 1;
  
  for (let i = 0; i < count; i++) {
    const pointsScored = [0, 0, 1, 2, 2, 2, 3][Math.floor(Math.random() * 7)];
    const isHomeTeam = Math.random() > 0.5;
    const playerName = getRandomElement(PLAYER_NAMES);
    const team = getRandomElement(TEAMS);
    
    if (isHomeTeam) {
      homeScore += pointsScored;
    } else {
      awayScore += pointsScored;
    }
    
    const minute = Math.floor(Math.random() * 12);
    const second = Math.floor(Math.random() * 60);
    const timeRemaining = `${minute}:${second.toString().padStart(2, '0')}`;
    
    let action = "";
    let description = "";
    
    if (pointsScored === 0) {
      action = "Erro";
      description = `${playerName} errou o arremesso.`;
    } else if (pointsScored === 1) {
      action = "Lance Livre";
      description = `${playerName} converteu o lance livre.`;
    } else if (pointsScored === 2) {
      action = "Cesta";
      description = `${playerName} marcou 2 pontos.`;
    } else if (pointsScored === 3) {
      action = "Três Pontos";
      description = `${playerName} acertou de 3!`;
    }
    
    updates.push({
      gameId,
      timestamp: new Date().toISOString(),
      action,
      description,
      score: {
        home: homeScore,
        away: awayScore
      },
      period: `Q${currentPeriod}`,
      timeRemaining
    });
  }
  
  // Ordenar do mais recente para o mais antigo
  return updates.reverse();
};
