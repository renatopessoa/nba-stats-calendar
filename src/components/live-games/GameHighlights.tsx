
import React, { useState, useEffect } from 'react';
import { Play, Film, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlayHighlight, Game } from '@/types/gameTypes';
import { fetchLiveGames, fetchGameHighlights } from '@/services/nbaService';

const GameHighlights: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [highlights, setHighlights] = useState<PlayHighlight[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<PlayHighlight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Buscar jogos ao vivo
        const liveGames = await fetchLiveGames();
        setGames(liveGames);
        
        // Se houver jogos ao vivo, buscar highlights para cada um
        if (liveGames.length > 0) {
          const allHighlights: PlayHighlight[] = [];
          
          // Buscar highlights para até 3 jogos (para evitar muitas requisições)
          const gamesToFetch = liveGames.slice(0, 3);
          
          for (const game of gamesToFetch) {
            const gameHighlights = await fetchGameHighlights(game.id);
            allHighlights.push(...gameHighlights);
          }
          
          setHighlights(allHighlights);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar highlights:', err);
        setError('Não foi possível carregar os highlights. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(fetchData, 300000);
    
    return () => clearInterval(interval);
  }, []);
  
  const refreshHighlights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar jogos ao vivo atualizados
      const liveGames = await fetchLiveGames();
      setGames(liveGames);
      
      // Se houver jogos ao vivo, buscar highlights para cada um
      if (liveGames.length > 0) {
        const allHighlights: PlayHighlight[] = [];
        
        // Buscar highlights para até 3 jogos
        const gamesToFetch = liveGames.slice(0, 3);
        
        for (const game of gamesToFetch) {
          const gameHighlights = await fetchGameHighlights(game.id);
          allHighlights.push(...gameHighlights);
        }
        
        setHighlights(allHighlights);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao atualizar highlights:', err);
      setError('Não foi possível atualizar os highlights. Tente novamente mais tarde.');
      setLoading(false);
    }
  };
  
  const handleHighlightClick = (highlight: PlayHighlight) => {
    setSelectedHighlight(highlight);
    setDialogOpen(true);
  };
  
  // Função para filtrar highlights com base na aba ativa
  const getFilteredHighlights = () => {
    if (activeTab === 'latest') {
      // Highlights mais recentes (primeiros 4)
      return highlights.slice(0, 4);
    } else {
      // Melhores da semana (próximos 4, ou se não houver suficientes, repetir)
      return highlights.length > 4 ? highlights.slice(4, 8) : highlights.slice(0, 4);
    }
  };
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Film className="h-5 w-5 text-primary" />
            <span>Highlights das Jogadas</span>
          </div>
          <Button variant="outline" size="sm" onClick={refreshHighlights} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Tabs 
            defaultValue="latest" 
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="latest">Mais Recentes</TabsTrigger>
              <TabsTrigger value="top">Melhores da Semana</TabsTrigger>
            </TabsList>
            
            <TabsContent value="latest" className="space-y-4 animate-fade-in">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="aspect-video rounded-lg" />
                  ))}
                </div>
              ) : highlights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredHighlights().map((highlight) => (
                    <HighlightCard 
                      key={highlight.id} 
                      highlight={highlight} 
                      onClick={() => handleHighlightClick(highlight)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum highlight disponível no momento.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="top" className="space-y-4 animate-fade-in">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="aspect-video rounded-lg" />
                  ))}
                </div>
              ) : highlights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredHighlights().map((highlight) => (
                    <HighlightCard 
                      key={highlight.id} 
                      highlight={highlight} 
                      onClick={() => handleHighlightClick(highlight)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum highlight disponível no momento.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
        
        {/* Dialog para exibir o vídeo do highlight */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
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
