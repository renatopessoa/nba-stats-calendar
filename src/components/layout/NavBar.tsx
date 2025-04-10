import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChartBar, User, List, Newspaper } from 'lucide-react';

const NavBar = () => {
  const [activeTab, setActiveTab] = useState('games');

  const tabs = [
    { id: 'games', label: 'Jogos', icon: Calendar },
    { id: 'gameStats', label: 'Estatísticas de Jogos', icon: ChartBar },
    { id: 'playerStats', label: 'Estatísticas de Jogadores', icon: User },
    { id: 'news', label: 'Notícias', icon: Newspaper },
    { id: 'standings', label: 'Classificação', icon: List },
  ];

  return (
    <div className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto py-3">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <img
              src="/images/ball.jpg"
              alt="Basketball"
              className="h-8 w-8 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold">Hoopverse</h1>
          </div>

          <nav className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className={`nav-item ${activeTab === tab.id ? 'nav-item-active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                    document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
