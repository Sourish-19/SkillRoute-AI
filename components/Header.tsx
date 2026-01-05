
import React from 'react';
import { StudentProfile } from '../types';
import { useTranslation } from './TranslationContext';

interface HeaderProps {
  profile: StudentProfile | null;
  onOpenProfile: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onOpenProfile }) => {
  const { t } = useTranslation();

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#09090b]/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">🔍</span>
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-medium">{profile?.name || 'New Student'}</span>
          <span className="text-xs text-emerald-500">{profile?.location || 'Unknown'}</span>
        </div>
        <button 
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          👤
        </button>
      </div>
    </header>
  );
};
