
import React, { useState, useEffect, useMemo } from 'react';
import { suggestOpportunities } from '../services/geminiService';
import { StudentProfile, LocalOpportunity } from '../types';
import { useTranslation } from './TranslationContext';

interface LocalOpportunitiesFeedProps {
  profile: StudentProfile;
  cachedData: LocalOpportunity[] | null;
  onUpdate: (data: LocalOpportunity[]) => void;
  searchQuery?: string;
}

export const LocalOpportunitiesFeed: React.FC<LocalOpportunitiesFeedProps> = ({ profile, cachedData, onUpdate, searchQuery = '' }) => {
  const { t } = useTranslation();
  const [opportunities, setOpportunities] = useState<LocalOpportunity[]>(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return;

    const fetchOpps = async () => {
      setLoading(true);
      try {
        const result = await suggestOpportunities(profile);
        setOpportunities(result);
        onUpdate(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, [profile, cachedData, onUpdate]);

  const filteredOpportunities = useMemo(() => {
    if (!searchQuery) return opportunities;
    const q = searchQuery.toLowerCase();
    return opportunities.filter(o => 
      o.title.toLowerCase().includes(q) || 
      o.company.toLowerCase().includes(q) || 
      o.description.toLowerCase().includes(q) ||
      o.type.toLowerCase().includes(q)
    );
  }, [opportunities, searchQuery]);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{t('localOpps')}</h2>
        <p className="text-zinc-500">Real-world projects matched to {profile.location}.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="glass h-64 rounded-2xl animate-pulse bg-zinc-900/50" />
          ))}
        </div>
      ) : (
        <>
          {filteredOpportunities.length === 0 ? (
            <div className="py-20 text-center glass rounded-2xl border-dashed">
              <p className="text-zinc-500">No matching opportunities found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => (
                <div key={opp.id} className="glass p-6 rounded-2xl flex flex-col h-full hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        {opp.type === 'NGO' ? '🤝' : opp.type === 'Internship' ? '🎓' : '💼'}
                      </span>
                      <div className="text-xs font-medium text-emerald-500 uppercase">{opp.type}</div>
                    </div>
                    <div className="text-xs font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-400">
                      {opp.matchScore}% Match
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-1">{opp.title}</h3>
                  <div className="text-sm text-zinc-400 mb-4">{opp.company}</div>
                  
                  <p className="text-sm text-zinc-500 flex-1 mb-6 line-clamp-3">
                    {opp.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <button className="text-sm font-semibold text-emerald-500 hover:underline">{t('viewDetails')}</button>
                    <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-500/10">
                      {t('applyNow')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
