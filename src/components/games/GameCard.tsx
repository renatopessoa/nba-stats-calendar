
import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Trophy } from 'lucide-react';
import { Game } from '@/types/gameTypes';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const isGameOver = game.status === 'completed';
  const homeWin = isGameOver && game.homeScore > game.awayScore;
  const awayWin = isGameOver && game.awayScore > game.homeScore;
  
  return (
    <div className="nba-card group animate-bounce-in">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-medium">
          {format(game.date, "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
        </div>
        <Badge variant={game.status === 'completed' ? "secondary" : game.status === 'live' ? "destructive" : "outline"}>
          {game.status === 'completed' ? 'Finalizado' : 
           game.status === 'live' ? 'Ao Vivo' : 'Em Breve'}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={`https://cdn.nba.com/logos/nba/${game.homeTeam.id}/global/L/logo.svg`} 
              alt={game.homeTeam.name} 
              className="team-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://cdn.nba.com/logos/nba/fallback/global/L/logo.svg';
              }}
            />
            {homeWin && (
              <Trophy className="absolute -right-1 -bottom-1 h-4 w-4 text-yellow-500" />
            )}
          </div>
          <div>
            <div className="font-bold">{game.homeTeam.abbreviation}</div>
            <div className="team-record">{game.homeTeam.record}</div>
          </div>
        </div>
        
        <div className="flex flex-col items-center px-4">
          {isGameOver ? (
            <div className="flex space-x-2">
              <span className={`score-badge ${homeWin ? 'score-badge-winner' : ''}`}>
                {game.homeScore}
              </span>
              <span>-</span>
              <span className={`score-badge ${awayWin ? 'score-badge-winner' : ''}`}>
                {game.awayScore}
              </span>
            </div>
          ) : game.status === 'live' ? (
            <div className="flex flex-col items-center">
              <div className="flex space-x-2 mb-1">
                <span className="score-badge">{game.homeScore}</span>
                <span>-</span>
                <span className="score-badge">{game.awayScore}</span>
              </div>
              <span className="text-xs font-medium text-destructive animate-pulse">
                {game.currentPeriod}
              </span>
            </div>
          ) : (
            <span className="text-sm font-medium">VS</span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-bold text-right">{game.awayTeam.abbreviation}</div>
            <div className="team-record text-right">{game.awayTeam.record}</div>
          </div>
          <div className="relative">
            <img 
              src={`https://cdn.nba.com/logos/nba/${game.awayTeam.id}/global/L/logo.svg`} 
              alt={game.awayTeam.name} 
              className="team-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://cdn.nba.com/logos/nba/fallback/global/L/logo.svg';
              }}
            />
            {awayWin && (
              <Trophy className="absolute -right-1 -bottom-1 h-4 w-4 text-yellow-500" />
            )}
          </div>
        </div>
      </div>
      
      {isGameOver && (
        <div className="mt-2 text-xs text-center text-muted-foreground">
          {game.arena}, {game.location}
        </div>
      )}
    </div>
  );
};

export default GameCard;
