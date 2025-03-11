
import React, { useEffect, useState } from 'react';
import { BarChart, RefreshCw, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { LiveGameUpdate, Game } from '@/types/gameTypes';
import { generateLiveUpdates } from '@/data/highlightsData';
import { generateGames } from '@/data/gameData';
import { generateGameStats } from '@/data/gameStatsData';

const LiveGameStats: React.FC = () => {
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameUpdates, setGameUpdates] = useState<LiveGameUpdate[]>([]);
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Gerar jogos aleatórios e filtrar apenas os jogos ao vivo
    const allGames = generateGames(new Date(), 10);
    const onlyLiveGames = allGames.filter(game => game.status === 'live');
    setLiveGames(onlyLiveGames);
    
    if (onlyLiveGames.length > 0) {
      setSelectedGame(onlyLiveGames[0]);
    }
    
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, []);
  
  useEffect(() => {
    if (selectedGame) {
      // Gerar atualizações iniciais
      const updates = generateLiveUpdates(selectedGame.id, 5);
      setGameUpdates(updates);
      
      // Configurar atualizações em tempo real
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      
      const interval = setInterval(() => {
        const newUpdate = generateLiveUpdates(selectedGame.id, 1)[0];
        setGameUpdates(prevUpdates => [newUpdate, ...prevUpdates.slice(0, 9)]);
        
        // Atualizar o placar do jogo selecionado
        setSelectedGame(prevGame => {
          if (!prevGame) return null;
          return {
            ...prevGame,
            homeScore: newUpdate.score.home,
            awayScore: newUpdate.score.away,
            currentPeriod: `${newUpdate.period} ${newUpdate.timeRemaining}`
          };
        });
        
        // Atualizar o placar na lista de jogos ao vivo
        setLiveGames(prevGames => {
          return prevGames.map(game => {
            if (game.id === selectedGame.id) {
              return {
                ...game,
                homeScore: newUpdate.score.home,
                awayScore: newUpdate.score.away,
                currentPeriod: `${newUpdate.period} ${newUpdate.timeRemaining}`
              };
            }
            return game;
          });
        });
      }, 5000);
      
      setUpdateInterval(interval);
    }
    
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [selectedGame]);
  
  const refreshStats = () => {
    if (selectedGame) {
      const updates = generateLiveUpdates(selectedGame.id, 5);
      setGameUpdates(updates);
    }
  };
  
  if (liveGames.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-500" />
            <span>Jogos ao Vivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Nenhum jogo ao vivo no momento.</p>
          <p className="text-sm mt-2">Volte mais tarde ou confira os próximos jogos no calendário.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!selectedGame) return null;
  
  const gameStats = generateGameStats();
  const homeTeam = selectedGame.homeTeam;
  const awayTeam = selectedGame.awayTeam;
  
  const homePercentage = Math.round((selectedGame.homeScore / (selectedGame.homeScore + selectedGame.awayScore)) * 100);
  const awayPercentage = 100 - homePercentage;
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-500 animate-pulse" />
            <span>Jogos ao Vivo</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Seletor de Jogos ao Vivo */}
        <div className="flex overflow-auto gap-2 mb-4 pb-1">
          {liveGames.map(game => (
            <Button
              key={game.id}
              variant={selectedGame?.id === game.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGame(game)}
              className="whitespace-nowrap"
            >
              {game.homeTeam.abbreviation} {game.homeScore} - {game.awayScore} {game.awayTeam.abbreviation}
            </Button>
          ))}
        </div>
        
        {/* Informações do Jogo Selecionado */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <img 
                src={`https://cdn.nba.com/logos/nba/${homeTeam.id}/global/L/logo.svg`}
                alt={homeTeam.name}
                className="h-8 w-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://cdn.nba.com/logos/nba/fallback/global/L/logo.svg';
                }}
              />
              <span className="font-semibold">{homeTeam.name}</span>
            </div>
            <div className="text-xl font-bold">
              {selectedGame.homeScore}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <img 
                src={`https://cdn.nba.com/logos/nba/${awayTeam.id}/global/L/logo.svg`}
                alt={awayTeam.name}
                className="h-8 w-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://cdn.nba.com/logos/nba/fallback/global/L/logo.svg';
                }}
              />
              <span className="font-semibold">{awayTeam.name}</span>
            </div>
            <div className="text-xl font-bold">
              {selectedGame.awayScore}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-1">
            <Badge variant="outline" className="bg-red-500/10 text-red-500 font-medium animate-pulse">
              AO VIVO
            </Badge>
            <span className="text-sm font-medium">{selectedGame.currentPeriod}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-1 mt-3">
            <div className="space-y-1">
              <Progress value={homePercentage} className="h-2" />
              <p className="text-xs text-center">{homePercentage}%</p>
            </div>
            <div className="space-y-1">
              <Progress value={awayPercentage} className="h-2" />
              <p className="text-xs text-center">{awayPercentage}%</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Estatísticas do Jogo */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 flex items-center">
            <BarChart className="h-4 w-4 mr-1" />
            Estatísticas do Jogo
          </h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Estatística</TableHead>
                <TableHead className="text-right">{homeTeam.abbreviation}</TableHead>
                <TableHead className="text-right">{awayTeam.abbreviation}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Rebotes</TableCell>
                <TableCell className="text-right">{gameStats.homeTeam.rebounds}</TableCell>
                <TableCell className="text-right">{gameStats.awayTeam.rebounds}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Assistências</TableCell>
                <TableCell className="text-right">{gameStats.homeTeam.assists}</TableCell>
                <TableCell className="text-right">{gameStats.awayTeam.assists}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Roubos</TableCell>
                <TableCell className="text-right">{gameStats.homeTeam.steals}</TableCell>
                <TableCell className="text-right">{gameStats.awayTeam.steals}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bloqueios</TableCell>
                <TableCell className="text-right">{gameStats.homeTeam.blocks}</TableCell>
                <TableCell className="text-right">{gameStats.awayTeam.blocks}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cestas 3P</TableCell>
                <TableCell className="text-right">{gameStats.homeTeam.threePointsMade}/{gameStats.homeTeam.threePointsAttempted}</TableCell>
                <TableCell className="text-right">{gameStats.awayTeam.threePointsMade}/{gameStats.awayTeam.threePointsAttempted}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <Separator className="my-4" />
        
        {/* Atualizações em Tempo Real */}
        <div>
          <h3 className="font-semibold mb-2">Atualizações em Tempo Real</h3>
          
          <div className="space-y-3 max-h-60 overflow-y-auto p-1">
            {gameUpdates.map((update, index) => (
              <div key={index} className="border-l-2 border-primary pl-3 py-1 animate-fade-in">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{update.period} | {update.timeRemaining}</span>
                  <span>{update.score.home} - {update.score.away}</span>
                </div>
                <p className="text-sm">
                  <span className="font-semibold">{update.action}:</span> {update.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveGameStats;
