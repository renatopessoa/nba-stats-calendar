
import React, { useState, useEffect } from 'react';
import { Play, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayHighlight } from '@/types/gameTypes';
import { generateHighlights } from '@/data/highlightsData';
import { generateGames } from '@/data/gameData';

const GameHighlights: React.FC = () => {
  const [games, setGames] = useState<{id: number, teams: string}[]>([]);
  const [highlights, setHighlights] = useState<PlayHighlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<PlayHighlight | null>(null);
  
  useEffect(() => {
    // Gerar jogos e highlights para demonstração
    const allGames = generateGames(new Date(), 5);
    
    // Mapear jogos para um formato mais simples
    const gamesList = allGames.map(game => ({
      id: game.id,
      teams: `${game.homeTeam.abbreviation} vs ${game.awayTeam.abbreviation}`
    }));
    
    setGames(gamesList);
    
    // Gerar highlights para todos os jogos
    let allHighlights: PlayHighlight[] = [];
    gamesList.forEach(game => {
      const gameHighlights = generateHighlights(game.id);
      allHighlights = [...allHighlights, ...gameHighlights];
    });
    
    setHighlights(allHighlights);
  }, []);
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Film className="h-5 w-5 text-primary" />
          <span>Highlights das Jogadas</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="latest">Mais Recentes</TabsTrigger>
            <TabsTrigger value="top">Melhores da Semana</TabsTrigger>
          </TabsList>
          
          <TabsContent value="latest" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.slice(0, 4).map((highlight) => (
                <HighlightCard 
                  key={highlight.id} 
                  highlight={highlight} 
                  onClick={() => setSelectedHighlight(highlight)} 
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="top" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.slice(4, 8).map((highlight) => (
                <HighlightCard 
                  key={highlight.id} 
                  highlight={highlight} 
                  onClick={() => setSelectedHighlight(highlight)} 
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Dialog para exibir o vídeo do highlight */}
        <Dialog>
          <DialogTrigger asChild>
            <span className="hidden">Open</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]" hidden={!selectedHighlight}>
            {selectedHighlight && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedHighlight.title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video relative">
                  <iframe
                    src={selectedHighlight.videoUrl}
                    className="w-full h-full"
                    title={selectedHighlight.title}
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-sm mt-2">{selectedHighlight.description}</p>
                {selectedHighlight.player && (
                  <Badge variant="outline" className="mt-2">
                    {selectedHighlight.player.name} | {selectedHighlight.player.team}
                  </Badge>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface HighlightCardProps {
  highlight: PlayHighlight;
  onClick: () => void;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ highlight, onClick }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-lg cursor-pointer hover-scale"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden rounded-lg">
        <img 
          src={highlight.thumbnailUrl} 
          alt={highlight.title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
        <h3 className="text-white font-semibold">{highlight.title}</h3>
        {highlight.player && (
          <div className="flex items-center mt-1">
            <Badge variant="secondary" className="text-xs">
              {highlight.player.name} | {highlight.player.team}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="absolute top-2 right-2">
        <Badge variant="destructive" className="flex items-center gap-1">
          <Play className="h-3 w-3" />
          {highlight.timestamp}
        </Badge>
      </div>
      
      <Button 
        variant="default"
        size="sm"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Play className="h-4 w-4 mr-1" /> Assistir
      </Button>
    </div>
  );
};

export default GameHighlights;
