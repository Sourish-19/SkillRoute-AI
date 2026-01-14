import React from 'react';
import { StudentProfile } from '../types.ts';
import { useTranslation } from './TranslationContext.tsx';

interface HeaderProps {
  profile: StudentProfile | null;
  onSearch: (query: string) => void;
  onOpenProfile: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onSearch, onOpenProfile, onToggleSidebar }) => {
  const { t } = useTranslation();

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6 bg-[#09090b]/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-zinc-400 hover:text-white"
        >
          ☰
        </button>


      </div>


    </header>
  );
};