
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon }) => {
  return (
    <div className="mb-6 flex items-center gap-2">
      <Icon className="h-6 w-6 text-primary" />
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="ml-3 flex-grow h-[2px] nba-gradient rounded-full"></div>
    </div>
  );
};

export default SectionHeader;
