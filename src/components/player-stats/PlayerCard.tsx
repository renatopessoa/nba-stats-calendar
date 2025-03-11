
import React from 'react';
import { Player } from '@/types/playerTypes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface PlayerCardProps {
  player: Player;
  statHighlight?: 'ppg' | 'rpg' | 'apg' | 'spg' | 'bpg';
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, statHighlight }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };
  
  const getStatColor = (statType: string) => {
    if (!statHighlight) return 'text-foreground';
    return statHighlight === statType ? 'text-primary font-bold' : 'text-muted-foreground';
  };
  
  return (
    <Card className="nba-card animate-bounce-in overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 nba-gradient"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage src={player.imageUrl} />
              <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">{player.name}</h3>
              <div className="flex items-center space-x-2">
                <img 
                  src={`https://cdn.nba.com/logos/nba/${player.team.id}/global/L/logo.svg`} 
                  alt={player.team.name} 
                  className="h-4 w-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://cdn.nba.com/logos/nba/fallback/global/L/logo.svg';
                  }}
                />
                <span className="text-sm text-muted-foreground">{player.team.name}</span>
              </div>
            </div>
          </div>
          <Badge>{player.position}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-1 text-center">
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${getStatColor('ppg')}`}>{player.stats.ppg}</span>
            <span className="text-xs text-muted-foreground">PPG</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${getStatColor('rpg')}`}>{player.stats.rpg}</span>
            <span className="text-xs text-muted-foreground">RPG</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${getStatColor('apg')}`}>{player.stats.apg}</span>
            <span className="text-xs text-muted-foreground">APG</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${getStatColor('spg')}`}>{player.stats.spg}</span>
            <span className="text-xs text-muted-foreground">SPG</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${getStatColor('bpg')}`}>{player.stats.bpg}</span>
            <span className="text-xs text-muted-foreground">BPG</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">FG%</span>
            <span>{player.stats.fgp}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">3P%</span>
            <span>{player.stats.tpp}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
