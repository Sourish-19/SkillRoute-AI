
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentProfile } from '../types';

interface AnalysisFormProps {
  onComplete: (profile: StudentProfile) => void;
  initialData?: StudentProfile;
}

const STEPS = [
  { id: 'identity', title: 'Who are you?', subtitle: 'Let\'s start with the basics.' },
  { id: 'skills', title: 'What do you do?', subtitle: 'Tell us about your background.' },
  { id: 'environment', title: 'Your Space', subtitle: 'How do you connect and communicate?' },
  { id: 'review', title: 'Ready to Launch?', subtitle: 'Review your route details.' }
];

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onComplete, initialData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StudentProfile>(initialData || {
    name: '',
    location: '',
    education: '',
    skills: [],
    interests: [],
    internetAccess: 'Moderate',
    preferredLanguage: 'English'
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.location) {
      onComplete(formData);
    }
  };

  const addItem = (field: 'skills' | 'interests', value: string, setFn: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setFn('');
    }
  };

  const removeItem = (field: 'skills' | 'interests', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-[3rem] pointer-events-none" />
      
      <div className="relative glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
        </div>

        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">{STEPS[currentStep].title}</h2>
            <p className="text-zinc-500 text-sm">{STEPS[currentStep].subtitle}</p>
          </div>
          <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
            Step {currentStep + 1} of {STEPS.length}
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
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">What's your full name?</label>
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
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Where are you based?</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">📍</span>
                    <input 
                      required
                      type="text" 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-14 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                      placeholder="e.g., Gorakhpur, UP"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 ml-1 italic">We optimize results for Tier-2 & Tier-3 city contexts.</p>
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
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Current Education</label>
                  <input 
                    type="text" 
                    value={formData.education} 
                    onChange={e => setFormData({...formData, education: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    placeholder="e.g., B.Tech Final Year"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Skills You Already Have</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={currentSkill} 
                      onChange={e => setCurrentSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('skills', currentSkill, setCurrentSkill))}
                      className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                      placeholder="Type and hit Enter..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.skills.map((s, i) => (
                      <motion.span 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={i} 
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs flex items-center gap-2 border border-emerald-500/20 font-medium"
                      >
                        {s} <button type="button" onClick={() => removeItem('skills', i)} className="hover:text-white transition-colors">✕</button>
                      </motion.span>
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
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">How reliable is your internet?</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { val: 'Low', label: 'Limited', desc: 'Slow speed / Data caps', icon: '📶' },
                      { val: 'Moderate', label: 'Moderate', desc: 'Consistent 4G', icon: '📡' },
                      { val: 'High', label: 'Fiber/5G', desc: 'High speed / Stable', icon: '🚀' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setFormData({...formData, internetAccess: opt.val as any})}
                        className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${
                          formData.internetAccess === opt.val 
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                            : 'bg-zinc-900/30 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <div className={`font-bold text-sm ${formData.internetAccess === opt.val ? 'text-emerald-400' : 'text-zinc-200'}`}>{opt.label}</div>
                          <div className="text-[10px] text-zinc-500 leading-tight">{opt.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Language Preference</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setFormData({...formData, preferredLanguage: lang})}
                        className={`px-4 py-3 rounded-xl border text-sm transition-all ${
                          formData.preferredLanguage === lang
                            ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                            : 'bg-zinc-900/50 border-white/5 text-zinc-400'
                        }`}
                      >
                        {lang}
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
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-xl">{formData.name}</h4>
                      <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">{formData.location}</p>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(0)} className="text-xs text-zinc-500 hover:text-white underline">Edit</button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter mb-1">Skills</p>
                      <p className="text-sm text-zinc-300">{formData.skills.length > 0 ? formData.skills.join(', ') : 'No skills added'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter mb-1">Education</p>
                      <p className="text-sm text-zinc-300">{formData.education || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter mb-1">Internet</p>
                      <p className="text-sm text-zinc-300">{formData.internetAccess}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-tighter mb-1">Language</p>
                      <p className="text-sm text-zinc-300">{formData.preferredLanguage}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex gap-4 items-center">
                  <div className="text-2xl">✨</div>
                  <p className="text-xs text-emerald-400 leading-relaxed italic">
                    Great! We'll use this data to generate a roadmap that accounts for your local infrastructure and market opportunities.
                  </p>
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
                Back
              </button>
            )}
            
            {currentStep < STEPS.length - 1 ? (
              <button 
                type="button"
                onClick={nextStep}
                disabled={currentStep === 0 && !formData.name}
                className="flex-1 bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
              >
                Continue
              </button>
            ) : (
              <button 
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                Generate My Career Route
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
