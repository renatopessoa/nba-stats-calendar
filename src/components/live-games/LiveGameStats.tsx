
import React, { useEffect, useState } from 'react';
import { BarChart, RefreshCw, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { LiveGameUpdate, Game, GameStats } from '@/types/gameTypes';
import { 
  fetchLiveGames, 
  fetchGameStats, 
  fetchLiveGameUpdates 
} from '@/services/nbaService';

const LiveGameStats: React.FC = () => {
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameUpdates, setGameUpdates] = useState<LiveGameUpdate[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Buscar jogos ao vivo quando o componente é montado
  useEffect(() => {
    const getLiveGames = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const games = await fetchLiveGames();
        setLiveGames(games);
        
        if (games.length > 0) {
          setSelectedGame(games[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar jogos ao vivo:', err);
        setError('Não foi possível carregar os jogos ao vivo. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    getLiveGames();
    
    // Configurar intervalo para atualizar jogos ao vivo a cada 60 segundos
    const gamesInterval = setInterval(() => {
      getLiveGames();
    }, 60000);
    
    return () => {
      clearInterval(gamesInterval);
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, []);
  
  // Buscar estatísticas e atualizações quando um jogo é selecionado
  useEffect(() => {
    if (selectedGame) {
      // Limpar o intervalo anterior
      if (updateInterval) {
        clearInterval(updateInterval);
      }
      
      const getGameData = async () => {
        try {
          // Buscar estatísticas do jogo
          const stats = await fetchGameStats(selectedGame.id);
          setGameStats(stats);
          
          // Buscar atualizações do jogo
          const updates = await fetchLiveGameUpdates(selectedGame.id);
          setGameUpdates(updates);
        } catch (err) {
          console.error('Erro ao buscar dados do jogo:', err);
        }
      };
      
      getGameData();
      
      // Configurar intervalo para atualizar dados a cada 15 segundos
      const interval = setInterval(() => {
        getGameData();
      }, 15000);
      
      setUpdateInterval(interval);
    }
    
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [selectedGame]);
  
  const refreshStats = async () => {
    if (selectedGame) {
      try {
        // Buscar estatísticas atualizadas
        const stats = await fetchGameStats(selectedGame.id);
        setGameStats(stats);
        
        // Buscar atualizações do jogo
        const updates = await fetchLiveGameUpdates(selectedGame.id);
        setGameUpdates(updates);
        
        // Buscar jogos ao vivo atualizados
        const games = await fetchLiveGames();
        setLiveGames(games);
        
        // Atualizar o jogo selecionado com os dados mais recentes
        const updatedGame = games.find(game => game.id === selectedGame.id);
        if (updatedGame) {
          setSelectedGame(updatedGame);
        }
      } catch (err) {
        console.error('Erro ao atualizar estatísticas:', err);
      }
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-500" />
            <span>Jogos ao Vivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="w-full h-8" />
            <div className="space-y-3">
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
            </div>
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-48" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-500" />
            <span>Jogos ao Vivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
  
  const homeTeam = selectedGame.homeTeam;
  const awayTeam = selectedGame.awayTeam;
  
  const homePercentage = Math.round((selectedGame.homeScore / (selectedGame.homeScore + selectedGame.awayScore || 1)) * 100);
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
          
          {gameStats ? (
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
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        {/* Atualizações em Tempo Real */}
        <div>
          <h3 className="font-semibold mb-2">Atualizações em Tempo Real</h3>
          
          {gameUpdates.length > 0 ? (
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
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveGameStats;
