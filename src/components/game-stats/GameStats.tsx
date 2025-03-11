
import React, { useState } from 'react';
import { ChartBar } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { generateGameStats } from '@/data/gameStatsData';
import SectionHeader from '../layout/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GameStats: React.FC = () => {
  const [gameStats] = useState(() => generateGameStats());
  
  const teamComparisonData = [
    { 
      name: 'Pontos', 
      [gameStats.homeTeam.abbreviation]: gameStats.homeTeam.points, 
      [gameStats.awayTeam.abbreviation]: gameStats.awayTeam.points 
    },
    { 
      name: 'Rebotes', 
      [gameStats.homeTeam.abbreviation]: gameStats.homeTeam.rebounds, 
      [gameStats.awayTeam.abbreviation]: gameStats.awayTeam.rebounds 
    },
    { 
      name: 'Assistências', 
      [gameStats.homeTeam.abbreviation]: gameStats.homeTeam.assists, 
      [gameStats.awayTeam.abbreviation]: gameStats.awayTeam.assists 
    },
    { 
      name: 'Roubos', 
      [gameStats.homeTeam.abbreviation]: gameStats.homeTeam.steals, 
      [gameStats.awayTeam.abbreviation]: gameStats.awayTeam.steals 
    },
    { 
      name: 'Bloqueios', 
      [gameStats.homeTeam.abbreviation]: gameStats.homeTeam.blocks, 
      [gameStats.awayTeam.abbreviation]: gameStats.awayTeam.blocks 
    },
    { 
      name: 'Turnovers', 
      [gameStats.homeTeam.abbreviation]: gameStats.homeTeam.turnovers, 
      [gameStats.awayTeam.abbreviation]: gameStats.awayTeam.turnovers 
    }
  ];
  
  const renderTeamStats = (team: 'home' | 'away') => {
    const teamData = team === 'home' ? gameStats.homeTeam : gameStats.awayTeam;
    
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Pontos" value={teamData.points} />
        <StatCard title="Rebotes" value={teamData.rebounds} />
        <StatCard title="Assistências" value={teamData.assists} />
        <StatCard title="Roubos" value={teamData.steals} />
        <StatCard title="Bloqueios" value={teamData.blocks} />
        <StatCard title="Turnovers" value={teamData.turnovers} />
        <StatCard 
          title="Arremessos de Quadra" 
          value={`${teamData.fieldGoalsMade}/${teamData.fieldGoalsAttempted}`}
          percentage={Math.round((teamData.fieldGoalsMade / teamData.fieldGoalsAttempted) * 100)}
        />
        <StatCard 
          title="Arremessos de 3" 
          value={`${teamData.threePointsMade}/${teamData.threePointsAttempted}`}
          percentage={Math.round((teamData.threePointsMade / teamData.threePointsAttempted) * 100)}
        />
        <StatCard 
          title="Lances Livres" 
          value={`${teamData.freeThrowsMade}/${teamData.freeThrowsAttempted}`}
          percentage={Math.round((teamData.freeThrowsMade / teamData.freeThrowsAttempted) * 100)}
        />
      </div>
    );
  };
  
  return (
    <section id="gameStats" className="py-10 animate-fade-in">
      <SectionHeader title="Estatísticas de Jogos" icon={ChartBar} />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img 
            src={`https://cdn.nba.com/logos/nba/${gameStats.homeTeam.id}/global/L/logo.svg`} 
            alt={gameStats.homeTeam.name} 
            className="team-logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://cdn.nba.com/logos/nba/fallback/global/L/logo.svg';
            }}
          />
          <div>
            <div className="font-bold">{gameStats.homeTeam.name}</div>
            <div className="text-sm text-muted-foreground">{gameStats.homeTeam.record}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-2xl font-bold px-2">{gameStats.homeTeam.points}</span>
          <span>-</span>
          <span className="text-2xl font-bold px-2">{gameStats.awayTeam.points}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-bold text-right">{gameStats.awayTeam.name}</div>
            <div className="text-sm text-muted-foreground text-right">{gameStats.awayTeam.record}</div>
          </div>
          <img 
            src={`https://cdn.nba.com/logos/nba/${gameStats.awayTeam.id}/global/L/logo.svg`} 
            alt={gameStats.awayTeam.name} 
            className="team-logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://cdn.nba.com/logos/nba/fallback/global/L/logo.svg';
            }}
          />
        </div>
      </div>
      
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="comparison">Comparação</TabsTrigger>
          <TabsTrigger value="home">{gameStats.homeTeam.abbreviation}</TabsTrigger>
          <TabsTrigger value="away">{gameStats.awayTeam.abbreviation}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Estatísticas</CardTitle>
              <CardDescription>
                Estatísticas comparativas entre {gameStats.homeTeam.name} e {gameStats.awayTeam.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={teamComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey={gameStats.homeTeam.abbreviation} 
                      name={gameStats.homeTeam.name}
                      fill="#17408B" 
                    />
                    <Bar 
                      dataKey={gameStats.awayTeam.abbreviation} 
                      name={gameStats.awayTeam.name}
                      fill="#C9082A" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="home" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{gameStats.homeTeam.name}</CardTitle>
              <CardDescription>Estatísticas detalhadas do time da casa</CardDescription>
            </CardHeader>
            <CardContent>
              {renderTeamStats('home')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="away" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>{gameStats.awayTeam.name}</CardTitle>
              <CardDescription>Estatísticas detalhadas do time visitante</CardDescription>
            </CardHeader>
            <CardContent>
              {renderTeamStats('away')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; percentage?: number }> = ({ 
  title, 
  value, 
  percentage 
}) => {
  return (
    <Card className="animate-pulse-gentle">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentage !== undefined && (
          <div className="text-sm text-muted-foreground">{percentage}%</div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameStats;
