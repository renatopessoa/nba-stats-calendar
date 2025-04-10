import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/layout/NavBar';
import GameCalendar from './components/games/GameCalendar';
import LiveGameStats from './components/live-games/LiveGameStats';
import GameHighlights from './components/live-games/GameHighlights';
import PlayerStats from './components/player-stats/PlayerStats';
import TeamStandings from './components/standings/TeamStandings';
import NewsSection from './components/news/NewsSection';
import { ThemeProvider } from './components/theme/ThemeProvider';
import ApiKeySettings from './components/settings/ApiKeySettings';
import './App.css';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider defaultTheme="system" storageKey="hoopverse-theme">
        <NavBar />
        <main className="container mx-auto py-6 px-4">
          <div className="flex justify-end mb-4">
            <ApiKeySettings />
          </div>

          <section id="games" className="mb-12">
            <GameCalendar />
          </section>

          <section id="gameStats" className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveGameStats />
              <GameHighlights />
            </div>
          </section>

          <section id="news" className="mb-12">
            <NewsSection />
          </section>

          <section id="playerStats" className="mb-12">
            <PlayerStats />
          </section>

          <section id="standings" className="mb-12">
            <TeamStandings />
          </section>
        </main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
