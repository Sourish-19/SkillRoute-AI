
import React, { useState, useEffect, useMemo } from 'react';
import { generateRoadmap } from '../services/geminiService';
import { StudentProfile, Roadmap } from '../types';
import { useTranslation } from './TranslationContext';

interface RoadmapBuilderProps {
  profile: StudentProfile;
  cachedData: Roadmap | null;
  onUpdate: (data: Roadmap) => void;
  searchQuery?: string;
}

export const RoadmapBuilder: React.FC<RoadmapBuilderProps> = ({ profile, cachedData, onUpdate, searchQuery = '' }) => {
  const { t } = useTranslation();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(cachedData);
  const [isLoading, setIsLoading] = useState(!cachedData);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const result = await generateRoadmap(profile);
      setRoadmap(result);
      onUpdate(result);
    } catch (error) {
      console.error("Failed to generate roadmap", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!cachedData) {
      fetchRoadmap();
    }
  }, [profile, cachedData]);

  const filteredSteps = useMemo(() => {
    if (!roadmap) return [];
    if (!searchQuery) return roadmap.steps;
    const q = searchQuery.toLowerCase();
    return roadmap.steps.filter(s => 
      s.topic.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q) ||
      s.tasks.some(task => task.toLowerCase().includes(q))
    );
  }, [roadmap, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Designing Your Path...</h3>
          <p className="text-zinc-500 max-w-sm">SkillRoute AI is analyzing your local constraints and market trends to create a custom 8-week plan.</p>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">{t('roadmap')}</h2>
          <p className="text-zinc-400">{t('targetGoal')}: <span className="text-emerald-500 font-medium">{roadmap.goal}</span></p>
        </div>
        <button 
          onClick={fetchRoadmap}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-xl transition-colors border border-zinc-700"
        >
          🔄 {t('regenerate')}
        </button>
      </div>

      {filteredSteps.length === 0 ? (
        <div className="py-20 text-center glass rounded-2xl border-dashed">
          <p className="text-zinc-500">No steps match your search "{searchQuery}"</p>
        </div>
      ) : (
        <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          {filteredSteps.map((step, idx) => (
            <div key={step.week} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 group-hover:border-emerald-500 transition-colors shadow-xl z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="text-xs font-bold text-zinc-400 group-hover:text-emerald-500">{step.week}</span>
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-2xl hover:bg-zinc-900/80 transition-all border border-zinc-800 group-hover:border-emerald-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    step.resourceType === 'Local' ? 'bg-blue-500/20 text-blue-400' : 
                    step.resourceType === 'Online' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {step.resourceType}
                  </span>
                  <span className="text-xs text-zinc-500">Week {step.week}</span>
                </div>
                <h4 className="font-bold text-lg mb-2">{step.topic}</h4>
                <p className="text-sm text-zinc-400 mb-4">{step.description}</p>
                <div className="space-y-2">
                  {step.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
