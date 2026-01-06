
import React from 'react';
import { useTranslation } from './TranslationContext';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  isMobileOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggle: () => void;
  onCloseMobile: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobileOpen, activeTab, onTabChange, onCloseMobile, onLogout }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'overview', label: t('dashboard'), icon: '📊' },
    { id: 'roadmap', label: t('roadmap'), icon: '🗺️' },
    { id: 'opportunities', label: t('localOpps'), icon: '📍' },
    { id: 'mentorship', label: t('mentorship'), icon: '🤝' },
    { id: 'profile', label: t('settings'), icon: '⚙️' },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col ${isMobile ? 'w-full' : ''}`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-emerald-500/20">
            S
          </div>
          {(isOpen || isMobile) && <h1 className="font-bold text-xl tracking-tight">SkillRoute <span className="text-emerald-500">AI</span></h1>}
        </div>
        {isMobile && (
          <button onClick={onCloseMobile} className="p-2 text-zinc-400 hover:text-white">✕</button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
          {(isOpen || isMobile) ? 'Main Navigation' : '•'}
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
            {(isOpen || isMobile) && <span>{item.label}</span>}
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
            {(isOpen || isMobile) && <span>{t('signOut')}</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-zinc-800 bg-[#09090b] transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-72 bg-[#09090b] border-r border-zinc-800 shadow-2xl"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
