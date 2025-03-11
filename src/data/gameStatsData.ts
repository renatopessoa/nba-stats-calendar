
import { GameStats, TeamStats } from "@/types/gameTypes";

const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateGameStats = (): GameStats => {
  // Home team stats
  const homeFieldGoalsMade = randomBetween(30, 45);
  const homeFieldGoalsAttempted = homeFieldGoalsMade + randomBetween(25, 40);
  const homeThreePointsMade = randomBetween(8, 18);
  const homeThreePointsAttempted = homeThreePointsMade + randomBetween(10, 20);
  const homeFreeThrowsMade = randomBetween(12, 25);
  const homeFreeThrowsAttempted = homeFreeThrowsMade + randomBetween(3, 10);
  
  const homePoints = (homeFieldGoalsMade - homeThreePointsMade) * 2 + homeThreePointsMade * 3 + homeFreeThrowsMade;
  
  // Away team stats
  const awayFieldGoalsMade = randomBetween(30, 45);
  const awayFieldGoalsAttempted = awayFieldGoalsMade + randomBetween(25, 40);
  const awayThreePointsMade = randomBetween(8, 18);
  const awayThreePointsAttempted = awayThreePointsMade + randomBetween(10, 20);
  const awayFreeThrowsMade = randomBetween(12, 25);
  const awayFreeThrowsAttempted = awayFreeThrowsMade + randomBetween(3, 10);
  
  const awayPoints = (awayFieldGoalsMade - awayThreePointsMade) * 2 + awayThreePointsMade * 3 + awayFreeThrowsMade;
  
  return {
    gameId: 1000000,
    homeTeam: {
      id: 1610612738,
      name: 'Boston Celtics',
      abbreviation: 'BOS',
      record: '64-18',
      points: homePoints,
      rebounds: randomBetween(35, 50),
      assists: randomBetween(20, 35),
      steals: randomBetween(5, 12),
      blocks: randomBetween(3, 8),
      turnovers: randomBetween(8, 18),
      fieldGoalsMade: homeFieldGoalsMade,
      fieldGoalsAttempted: homeFieldGoalsAttempted,
      threePointsMade: homeThreePointsMade,
      threePointsAttempted: homeThreePointsAttempted,
      freeThrowsMade: homeFreeThrowsMade,
      freeThrowsAttempted: homeFreeThrowsAttempted,
    },
    awayTeam: {
      id: 1610612747,
      name: 'Los Angeles Lakers',
      abbreviation: 'LAL',
      record: '47-35',
      points: awayPoints,
      rebounds: randomBetween(35, 50),
      assists: randomBetween(20, 35),
      steals: randomBetween(5, 12),
      blocks: randomBetween(3, 8),
      turnovers: randomBetween(8, 18),
      fieldGoalsMade: awayFieldGoalsMade,
      fieldGoalsAttempted: awayFieldGoalsAttempted,
      threePointsMade: awayThreePointsMade,
      threePointsAttempted: awayThreePointsAttempted,
      freeThrowsMade: awayFreeThrowsMade,
      freeThrowsAttempted: awayFreeThrowsAttempted,
    }
  };
};
