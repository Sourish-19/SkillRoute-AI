
import React, { useState, useEffect } from 'react';
import { suggestOpportunities } from '../services/geminiService';
import { StudentProfile, LocalOpportunity } from '../types';

interface LocalOpportunitiesFeedProps {
  profile: StudentProfile;
  cachedData: LocalOpportunity[] | null;
  onUpdate: (data: LocalOpportunity[]) => void;
}

export const LocalOpportunitiesFeed: React.FC<LocalOpportunitiesFeedProps> = ({ profile, cachedData, onUpdate }) => {
  const [opportunities, setOpportunities] = useState<LocalOpportunity[]>(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return; // Prevent reload if we already have data

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

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Local Opportunities</h2>
        <p className="text-zinc-500">Real-world projects and roles matched to your location and accessibility constraints.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="glass h-64 rounded-2xl animate-pulse bg-zinc-900/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div key={opp.id} className="glass p-6 rounded-2xl flex flex-col h-full hover:border-emerald-500/50 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    {opp.type === 'NGO' ? '🤝' : opp.type === 'Internship' ? '🎓' : '💼'}
                  </span>
                  <div className="text-xs font-medium text-emerald-500 uppercase">{opp.type}</div>
                </div>
                <div className="text-xs font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-400 group-hover:text-emerald-500 transition-colors">
                  {opp.matchScore}% Match
                </div>
              </div>

              <h3 className="font-bold text-lg mb-1">{opp.title}</h3>
              <div className="text-sm text-zinc-400 mb-4">{opp.company} • {opp.location}</div>
              
              <p className="text-sm text-zinc-500 flex-1 mb-6 line-clamp-3">
                {opp.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <button className="text-sm font-semibold text-emerald-500 hover:underline">View Details</button>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-lg transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
