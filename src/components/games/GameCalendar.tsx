
import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '../layout/SectionHeader';
import GameCard from './GameCard';
import { generateGames } from '@/data/gameData';

const GameCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [games, setGames] = useState(() => generateGames(currentDate, 5));

  const nextDay = () => {
    const newDate = addDays(currentDate, 1);
    setCurrentDate(newDate);
    setGames(generateGames(newDate, 5));
  };

  const prevDay = () => {
    const newDate = subDays(currentDate, 1);
    setCurrentDate(newDate);
    setGames(generateGames(newDate, 5));
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
    setGames(generateGames(date, 5));
  };

  return (
    <section id="games" className="py-10 animate-fade-in">
      <SectionHeader title="Calendário de Jogos" icon={Calendar} />
      
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};

export default GameCalendar;
