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

  const handleGoogleAuth = async () => {
    // Mock Google Auth logic for development
    // In production, this would involve Google's OAuth SDK to get an ID token
    try {
      const mockGoogleToken = "mock_google_token_" + Date.now();
      const data = await api.post('/auth/google', {
        email: email || "google_user@example.com",
        name: "Google User",
        googleToken: mockGoogleToken
      });
      localStorage.setItem('skillroute_token', data.token);
      onAuth(data.user.email);
      navigate('/dashboard'); // Redirect
    } catch (err: any) {
      setError(err.message || 'Google Auth failed');
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

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-all mt-2 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google (Dev)
          </button>
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
