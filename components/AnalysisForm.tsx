
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentProfile } from '../types';
import { useTranslation, SupportedLanguage } from './TranslationContext';

interface AnalysisFormProps {
  onComplete: (profile: StudentProfile) => void;
  initialData?: StudentProfile;
}

const STEPS = [
  { id: 'identity', titleKey: 'whoAreYou', subtitleKey: 'basicsSubtitle' },
  { id: 'skills', titleKey: 'professionalProfile', subtitleKey: 'basicsSubtitle' },
  { id: 'environment', titleKey: 'localContext', subtitleKey: 'basicsSubtitle' },
  { id: 'review', titleKey: 'readyToLaunch', subtitleKey: 'basicsSubtitle' }
];

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onComplete, initialData }) => {
  const { t, language } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StudentProfile>(initialData || {
    name: '',
    location: '',
    education: '',
    skills: [],
    interests: [],
    internetAccess: 'Moderate',
    preferredLanguage: language
  });

  const [currentSkill, setCurrentSkill] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.location) {
      onComplete(formData);
    }
  };

  const addItem = (field: 'skills', value: string, setFn: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setFn('');
    }
  };

  const removeItem = (field: 'skills', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-[3rem] pointer-events-none" />
      
      <div className="relative glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
        </div>

        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{t(STEPS[currentStep].titleKey)}</h2>
            <p className="text-zinc-500 text-sm">{t(STEPS[currentStep].subtitleKey)}</p>
          </div>
          <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
            Step {currentStep + 1} / {STEPS.length}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">UI Language</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setFormData({...formData, preferredLanguage: lang})}
                        className={`px-3 py-2 rounded-xl border text-xs transition-all ${
                          formData.preferredLanguage === lang
                            ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                            : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-emerald-500/30'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('fullName')}</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-lg"
                    placeholder="Anjali Sharma"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('location')}</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">📍</span>
                    <input 
                      required
                      type="text" 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-14 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                      placeholder="Gorakhpur, UP"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('education')}</label>
                  <input 
                    type="text" 
                    value={formData.education} 
                    onChange={e => setFormData({...formData, education: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('skills')}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={currentSkill} 
                      onChange={e => setCurrentSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('skills', currentSkill, setCurrentSkill))}
                      className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.skills.map((s, i) => (
                      <span key={i} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs flex items-center gap-2 border border-emerald-500/20">
                        {s} <button type="button" onClick={() => removeItem('skills', i)}>✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 flex-1"
              >
                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">{t('internetReliability')}</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { val: 'Low', icon: '📶' },
                      { val: 'Moderate', icon: '📡' },
                      { val: 'High', icon: '🚀' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setFormData({...formData, internetAccess: opt.val as any})}
                        className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                          formData.internetAccess === opt.val 
                            ? 'bg-emerald-500/10 border-emerald-500/50' 
                            : 'bg-zinc-900/30 border-white/5'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="font-bold">{opt.val}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 flex-1"
              >
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 space-y-4 text-center">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">🚀</div>
                  <h4 className="text-2xl font-bold">{formData.name}</h4>
                  <p className="text-emerald-500 font-medium">{formData.location}</p>
                  <div className="pt-4 text-zinc-500 text-sm leading-relaxed">
                    All settings have been saved. Ready to generate your custom path in {formData.preferredLanguage}?
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex gap-4">
            {currentStep > 0 && (
              <button 
                type="button"
                onClick={prevStep}
                className="px-8 py-4 bg-zinc-900 text-zinc-300 font-bold rounded-2xl hover:bg-zinc-800 transition-colors border border-white/5"
              >
                {t('back')}
              </button>
            )}
            
            {currentStep < STEPS.length - 1 ? (
              <button 
                type="button"
                onClick={nextStep}
                disabled={currentStep === 0 && (!formData.name || !formData.location)}
                className="flex-1 bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50"
              >
                {t('continue')}
              </button>
            ) : (
              <button 
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
              >
                {t('generateRoute')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
