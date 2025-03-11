
import React from 'react';
import { Team } from '@/types/teamTypes';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface StandingsTableProps {
  teams: Team[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ teams }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Pos</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">V</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">%</TableHead>
            <TableHead className="text-center hidden md:table-cell">GB</TableHead>
            <TableHead className="text-center hidden md:table-cell">Casa</TableHead>
            <TableHead className="text-center hidden md:table-cell">Fora</TableHead>
            <TableHead className="text-center hidden lg:table-cell">Últimos 10</TableHead>
            <TableHead className="text-center hidden lg:table-cell">Sequência</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => {
            // Highlight playoff positions (top 8)
            const isPlayoffTeam = index < 8;
            // Highlight play-in positions (9-10)
            const isPlayInTeam = index >= 8 && index < 10;
            
            return (
              <TableRow 
                key={team.id}
                className={
                  isPlayoffTeam 
                    ? 'bg-muted/30'
                    : isPlayInTeam
                      ? 'bg-muted/10'
                      : ''
                }
              >
                <TableCell className="font-medium">
                  {index + 1}
                  {isPlayoffTeam && index < 6 && (
                    <span className="ml-1 text-xs text-primary">★</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={`https://cdn.nba.com/logos/nba/${team.id}/global/L/logo.svg`} 
                      alt={team.name} 
                      className="h-6 w-6"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://cdn.nba.com/logos/nba/fallback/global/L/logo.svg';
                      }}
                    />
                    <span className="hidden md:inline">{team.name}</span>
                    <span className="inline md:hidden">{team.abbreviation}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">{team.wins}</TableCell>
                <TableCell className="text-center">{team.losses}</TableCell>
                <TableCell className="text-center">
                  {((team.wins / (team.wins + team.losses)) * 100).toFixed(1)}
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">{team.gamesBehind}</TableCell>
                <TableCell className="text-center hidden md:table-cell">{team.homeRecord}</TableCell>
                <TableCell className="text-center hidden md:table-cell">{team.awayRecord}</TableCell>
                <TableCell className="text-center hidden lg:table-cell">{team.lastTenRecord}</TableCell>
                <TableCell className="text-center hidden lg:table-cell">
                  <span className={
                    team.streak.startsWith('W') 
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }>
                    {team.streak}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StandingsTable;
