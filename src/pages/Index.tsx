
import React from 'react';
import NavBar from '@/components/layout/NavBar';
import GameCalendar from '@/components/games/GameCalendar';
import GameStats from '@/components/game-stats/GameStats';
import PlayerStats from '@/components/player-stats/PlayerStats';
import TeamStandings from '@/components/standings/TeamStandings';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 pb-20">
        <GameCalendar />
        <GameStats />
        <PlayerStats />
        <TeamStandings />
      </main>
      
      <footer className="py-6 border-t bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2 inline-block h-1 w-32 nba-gradient rounded-full"></div>
          <p className="text-sm text-muted-foreground">
            NBA Stats App &copy; {new Date().getFullYear()} - Dados para fins ilustrativos
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
