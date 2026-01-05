
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { suggestMentors, getMentorAdvice } from '../services/geminiService';
import { StudentProfile } from '../types';

interface Mentor {
  name: string;
  role: string;
  description: string;
  specialty: string;
}

interface MentorshipProps {
  profile: StudentProfile;
  cachedData: Mentor[] | null;
  onUpdate: (data: Mentor[]) => void;
}

export const Mentorship: React.FC<MentorshipProps> = ({ profile, cachedData, onUpdate }) => {
  const [mentors, setMentors] = useState<Mentor[]>(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'mentor'; text: string }[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (cachedData) return;

    const fetchMentors = async () => {
      setLoading(true);
      try {
        const result = await suggestMentors(profile);
        setMentors(result);
        onUpdate(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, [profile, cachedData, onUpdate]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedMentor || isSending) return;

    const userText = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsSending(true);

    try {
      const advice = await getMentorAdvice(profile, selectedMentor.name, selectedMentor.role, userText);
      setChatHistory(prev => [...prev, { role: 'mentor', text: advice || 'I am sorry, I am having trouble connecting right now.' }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'mentor', text: 'Error connecting to your mentor. Please try again later.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Mentorship Network</h2>
        <p className="text-zinc-500">Connect with local experts and guides who can help you navigate your unique career path.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass h-48 rounded-2xl animate-pulse bg-zinc-900/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor, idx) => (
            <div key={idx} className="glass p-6 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all bg-zinc-900/40 group flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👤
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{mentor.name}</h3>
                  <div className="text-xs text-emerald-500 font-bold uppercase tracking-widest">{mentor.role}</div>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-4 flex-1">{mentor.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-xs text-zinc-500 italic">Focus: {mentor.specialty}</span>
                <button 
                  onClick={() => {
                    setSelectedMentor(mentor);
                    setChatHistory([]);
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-emerald-500 hover:text-black font-bold text-xs rounded-xl transition-all"
                >
                  Start Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Overlay */}
      <AnimatePresence>
        {selectedMentor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[80vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">👤</div>
                  <div>
                    <h4 className="font-bold text-white">{selectedMentor.name}</h4>
                    <p className="text-xs text-emerald-500 font-bold">{selectedMentor.role}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMentor(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">✕</button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatHistory.length === 0 && (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-4">👋</div>
                    <p className="text-zinc-400 text-sm">Say hello to {selectedMentor.name} and ask your questions about your career in {profile.location}.</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-emerald-500 text-black font-medium' 
                        : 'bg-zinc-800/80 text-zinc-100 border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800/80 px-4 py-3 rounded-2xl flex gap-1">
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleChat} className="p-6 border-t border-white/10 bg-zinc-900/50 flex gap-3">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Ask for advice..."
                  className="flex-1 bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button 
                  type="submit"
                  disabled={isSending || !chatMessage.trim()}
                  className="px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
