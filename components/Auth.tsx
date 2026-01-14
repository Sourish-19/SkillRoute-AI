import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  onBack: () => void;
  onAuth: (email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onBack, onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = await api.post(endpoint, { email, password });

      localStorage.setItem('skillroute_token', data.token);
      onAuth(data.user.email);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full" />

      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors"
      >
        ← Back to Landing
      </button>

      <div className="w-full max-w-md relative z-10 glass p-10 rounded-[2.5rem] border-zinc-800 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-bold text-black text-2xl mx-auto mb-6">S</div>
          <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Join SkillRoute'}</h2>
          <p className="text-zinc-500 text-sm">Enter your details to access your career roadmap.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-center text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-zinc-700"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-zinc-700"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#10b981" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-black font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-zinc-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-emerald-500 font-bold hover:underline transition-all"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};
