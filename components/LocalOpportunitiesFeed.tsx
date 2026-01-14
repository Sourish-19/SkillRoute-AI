import React, { useState, useEffect, useMemo } from 'react';
import { suggestOpportunities } from '../services/geminiService.ts';
import { StudentProfile, LocalOpportunity } from '../types.ts';
import { useTranslation } from './TranslationContext.tsx';

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

  const [selectedOpp, setSelectedOpp] = useState<LocalOpportunity | null>(null);
  const [viewingDetailsOpp, setViewingDetailsOpp] = useState<LocalOpportunity | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState<string | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsApplying(false);
    setApplicationSuccess(selectedOpp?.title || 'Opportunity');
    setSelectedOpp(null);
    setTimeout(() => setApplicationSuccess(null), 3000);
  };

  return (
    <div className="animate-in fade-in duration-700 relative">
      {applicationSuccess && (
        <div className="fixed top-4 right-4 z-[100] bg-emerald-500 text-black px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-top-4 font-bold flex items-center gap-2">
          <span>✅</span> Application Sent to {applicationSuccess}!
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{t('localOpps')}</h2>
        <p className="text-zinc-500">Real-world projects matched to {profile.location}.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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
                <div key={opp.id} className="glass p-6 rounded-2xl flex flex-col h-full hover:border-emerald-500/50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl">
                      {opp.type === 'NGO' ? '🤝' : opp.type === 'Internship' ? '🎓' : '💼'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                        {opp.type}
                      </span>
                    </div>
                    <div className="text-xs font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {opp.matchScore}% Match
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-1 leading-tight">{opp.title}</h3>
                  <div className="text-sm text-zinc-400 mb-4 font-medium">{opp.company}</div>

                  <p className="text-sm text-zinc-500 flex-1 mb-6 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <button
                      onClick={() => setViewingDetailsOpp(opp)}
                      className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setSelectedOpp(opp)}
                      className="px-4 py-2 bg-white text-black hover:bg-emerald-400 font-bold text-xs rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-0.5"
                    >
                      {t('applyNow')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Application Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div>
                <h3 className="text-lg font-bold">Apply to {selectedOpp.company}</h3>
                <p className="text-xs text-zinc-500">{selectedOpp.title}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={profile.name}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Why are you a good fit?</label>
                <textarea
                  rows={4}
                  placeholder="I have the skills required for this role because..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOpp(null)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isApplying ? (
                    <>
                      <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {viewingDetailsOpp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header with Image/Pattern */}
            <div className="h-32 bg-gradient-to-r from-emerald-900/20 to-zinc-900 relative">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute -bottom-6 left-6 flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border-4 border-[#09090b] flex items-center justify-center text-4xl shadow-xl">
                  {viewingDetailsOpp.type === 'NGO' ? '🤝' : viewingDetailsOpp.type === 'Internship' ? '🎓' : '💼'}
                </div>
                <div className="mb-2">
                  <h2 className="text-xl font-bold text-white leading-none mb-1">{viewingDetailsOpp.company}</h2>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>📍 {viewingDetailsOpp.location}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{viewingDetailsOpp.matchScore}% Match</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingDetailsOpp(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors backdrop-blur-md"
              >
                ✕
              </button>
            </div>

            <div className="p-8 pt-10 overflow-y-auto space-y-8">
              <div>
                <h1 className="text-2xl font-bold mb-4">{viewingDetailsOpp.title}</h1>
                <p className="text-zinc-400 leading-relaxed">
                  {viewingDetailsOpp.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Stipend</div>
                  <div className="font-semibold text-emerald-400">
                    {/* @ts-ignore - stipend might be missing in strict types but present in enriched data */}
                    {viewingDetailsOpp.stipend || "Unpaid / Volunteer"}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Duration</div>
                  <div className="font-semibold text-white">
                    {/* @ts-ignore */}
                    {viewingDetailsOpp.duration || "Flexible"}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Requirements / Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {/* @ts-ignore */}
                  {(viewingDetailsOpp.requirements || ["Motivated", "Local", "Willing to learn"]).map((req, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                      {req}
                    </span>
                  ))}
                  <span key="role" className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold border border-zinc-700">
                    {viewingDetailsOpp.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3 sticky bottom-0 backdrop-blur-md">
              <button
                onClick={() => setViewingDetailsOpp(null)}
                className="px-5 py-2.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewingDetailsOpp(null);
                  setSelectedOpp(viewingDetailsOpp);
                }}
                className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10 transform hover:-translate-y-0.5"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};