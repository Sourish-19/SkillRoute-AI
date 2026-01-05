
import React from 'react';
import { useTranslation } from './TranslationContext';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggle: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange, onLogout }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'overview', label: t('dashboard'), icon: '📊' },
    { id: 'roadmap', label: t('roadmap'), icon: '🗺️' },
    { id: 'opportunities', label: t('localOpps'), icon: '📍' },
    { id: 'mentorship', label: t('mentorship'), icon: '🤝' },
    { id: 'profile', label: t('settings'), icon: '⚙️' },
  ];

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-zinc-800 bg-[#09090b] flex flex-col z-40`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black text-xl">
          S
        </div>
        {isOpen && <h1 className="font-bold text-xl tracking-tight">SkillRoute <span className="text-emerald-500">AI</span></h1>}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
          {isOpen ? 'Main Navigation' : '•'}
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20' 
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-zinc-800 space-y-2">
        {onLogout && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-zinc-400 hover:bg-red-500/10 hover:text-red-400`}
          >
            <span className="text-xl">🚪</span>
            {isOpen && <span>{t('signOut')}</span>}
          </button>
        )}
      </div>
    </aside>
  );
};
