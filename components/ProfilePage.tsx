
import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { StudentProfile } from '../types';
import { useTranslation } from './TranslationContext';

interface ProfilePageProps {
  profile: StudentProfile;
  userEmail: string;
  onUpdate: (profile: StudentProfile) => void;
  onUpdateEmail: (email: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, userEmail, onUpdate, onUpdateEmail }) => {
  const { t } = useTranslation();
  const [editedProfile, setEditedProfile] = useState<StudentProfile>({ ...profile });
  const [editedEmail, setEditedEmail] = useState(userEmail);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(editedProfile);
      onUpdateEmail(editedEmail);
      setIsSaving(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({ ...editedProfile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{t('profileSettings')}</h2>
          <p className="text-zinc-500">Manage your account credentials and professional route details.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
            saveStatus === 'success' 
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
              : 'bg-white text-black hover:bg-zinc-200'
          }`}
        >
          {isSaving ? t('saving') : saveStatus === 'success' ? `✓ ${t('saved')}` : t('saveChanges')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture & Basic Info */}
        <div className="space-y-8">
          <section className="glass p-8 rounded-[2rem] border-white/5 bg-zinc-900/40 text-center">
             <div className="relative inline-block group mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-800 border-4 border-zinc-800 group-hover:border-emerald-500 transition-all shadow-2xl">
                  {editedProfile.avatar ? (
                    <img src={editedProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-emerald-500 text-black rounded-full flex items-center justify-center border-4 border-zinc-900 group-hover:scale-110 transition-transform shadow-lg"
                >
                  📷
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
             </div>
             <div>
                <h4 className="text-xl font-bold">{editedProfile.name}</h4>
                <p className="text-zinc-500 text-sm">{editedProfile.education}</p>
             </div>
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="mt-6 w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
             >
               {t('uploadPhoto')}
             </button>
          </section>

          <section className="glass p-8 rounded-[2rem] border-white/5 bg-zinc-900/40">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <span className="text-emerald-500 text-xl">📍</span> {t('localContext')}
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">City / Location</label>
                <input 
                  type="text" 
                  value={editedProfile.location}
                  onChange={e => setEditedProfile({...editedProfile, location: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Preferred UI Language</label>
                <select 
                  value={editedProfile.preferredLanguage}
                  onChange={e => setEditedProfile({...editedProfile, preferredLanguage: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none text-zinc-300 font-bold"
                >
                  {['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali'].map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <p className="text-[10px] text-emerald-500/60 ml-1 italic">Changing this updates the whole interface instantly.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Account & Professional Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass p-8 rounded-[2rem] border-white/5 bg-zinc-900/40">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <span className="text-emerald-500 text-xl">🛡️</span> {t('accountCredentials')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={editedProfile.name}
                  onChange={e => setEditedProfile({...editedProfile, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={editedEmail}
                  onChange={e => setEditedEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-[2rem] border-white/5 bg-zinc-900/40">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <span className="text-emerald-500 text-xl">💼</span> {t('professionalProfile')}
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Current Education / Role</label>
                <input 
                  type="text" 
                  value={editedProfile.education}
                  onChange={e => setEditedProfile({...editedProfile, education: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Skills (comma separated)</label>
                <input 
                  type="text" 
                  value={editedProfile.skills.join(', ')}
                  onChange={e => setEditedProfile({...editedProfile, skills: e.target.value.split(',').map(s => s.trim())})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
