
import React, { useState } from 'react';
import { List } from 'lucide-react';
import { generateConferenceStandings } from '@/data/standingsData';
import SectionHeader from '../layout/SectionHeader';
import StandingsTable from './StandingsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeamStandings: React.FC = () => {
  const [conferencesData] = useState(() => generateConferenceStandings());
  
  return (
    <section id="standings" className="py-10 animate-fade-in">
      <SectionHeader title="Classificação das Equipes" icon={List} />
      
      <Tabs defaultValue="east" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="east">Conferência Leste</TabsTrigger>
          <TabsTrigger value="west">Conferência Oeste</TabsTrigger>
        </TabsList>
        
        <TabsContent value="east" className="animate-fade-in">
          <StandingsTable teams={conferencesData.east} />
        </TabsContent>
        
        <TabsContent value="west" className="animate-fade-in">
          <StandingsTable teams={conferencesData.west} />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default TeamStandings;
