
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { generateTopPlayers } from '@/data/playerStatsData';
import SectionHeader from '../layout/SectionHeader';
import PlayerCard from './PlayerCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const PlayerStats: React.FC = () => {
  const [topPlayers] = useState(() => generateTopPlayers());
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPlayers = topPlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getPlayersByCategory = (category: string) => {
    if (category === 'all') return filteredPlayers;
    
    return filteredPlayers.sort((a, b) => {
      if (category === 'points') return b.stats.ppg - a.stats.ppg;
      if (category === 'rebounds') return b.stats.rpg - a.stats.rpg;
      if (category === 'assists') return b.stats.apg - a.stats.apg;
      if (category === 'steals') return b.stats.spg - a.stats.spg;
      if (category === 'blocks') return b.stats.bpg - a.stats.bpg;
      return 0;
    }).slice(0, 10);
  };
  
  return (
    <section id="playerStats" className="py-10 animate-fade-in">
      <SectionHeader title="Estatísticas de Jogadores" icon={User} />
      
      <div className="mb-6">
        <Input
          placeholder="Buscar jogador ou time..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="points">Pontos</TabsTrigger>
          <TabsTrigger value="rebounds">Rebotes</TabsTrigger>
          <TabsTrigger value="assists">Assistências</TabsTrigger>
          <TabsTrigger value="steals">Roubos</TabsTrigger>
          <TabsTrigger value="blocks">Bloqueios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getPlayersByCategory('all').map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="points" className="animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getPlayersByCategory('points').map((player) => (
              <PlayerCard key={player.id} player={player} statHighlight="ppg" />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rebounds" className="animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getPlayersByCategory('rebounds').map((player) => (
              <PlayerCard key={player.id} player={player} statHighlight="rpg" />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="assists" className="animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getPlayersByCategory('assists').map((player) => (
              <PlayerCard key={player.id} player={player} statHighlight="apg" />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="steals" className="animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getPlayersByCategory('steals').map((player) => (
              <PlayerCard key={player.id} player={player} statHighlight="spg" />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="blocks" className="animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getPlayersByCategory('blocks').map((player) => (
              <PlayerCard key={player.id} player={player} statHighlight="bpg" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default PlayerStats;
