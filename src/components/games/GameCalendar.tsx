
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SectionHeader from '../layout/SectionHeader';
import GameCard from './GameCard';
import { fetchGamesByDate } from '@/services/nbaService';

const GameCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames(currentDate);
  }, [currentDate]);

  const fetchGames = async (date: Date) => {
    setLoading(true);
    setError(null);
    
    try {
      const gamesData = await fetchGamesByDate(date);
      setGames(gamesData);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar jogos:', err);
      setError('Não foi possível carregar os jogos. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const nextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const prevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const datePickOptions = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i - 3);
    return {
      value: date,
      label: format(date, 'EEE, dd MMM', { locale: pt })
    };
  });

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
  };

  const refreshGames = () => {
    fetchGames(currentDate);
  };

  return (
    <section id="games" className="py-10 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <SectionHeader title="Calendário de Jogos" icon={Calendar} />
        <Button variant="outline" size="sm" onClick={refreshGames} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={prevDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex overflow-x-auto gap-2 py-2 mx-2">
          {datePickOptions.map((option) => (
            <Button
              key={option.label}
              variant={format(currentDate, 'yyyy-MM-dd') === format(option.value, 'yyyy-MM-dd') ? "default" : "outline"}
              className="whitespace-nowrap"
              onClick={() => handleDateClick(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        
        <Button variant="outline" size="icon" onClick={nextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      ) : games.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhum jogo programado para esta data.</p>
        </div>
      )}
    </section>
  );
};

export default GameCalendar;
