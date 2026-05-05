import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  User, Github, Linkedin, Globe 
} from 'lucide-react';
import { GlassCard } from './UI';

interface LoginViewProps {
  onLogin: (user: { name: string; email: string; targetRole?: string }) => void;
}

export const LoginView = ({ onLogin }: LoginViewProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('General');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mocking a network delay for premium feel
    setTimeout(() => {
      if (mode === 'login') {
        if (email === 'deep@mail.com' && password === 'deep12345') {
          onLogin({ name: 'Deep', email: 'deep@mail.com' });
        } else {
          setError('Invalid credentials. Try deep@mail.com / deep12345');
          setIsLoading(false);
        }
      } else {
        // Simple signup simulation
        onLogin({ name: name || 'New User', email, targetRole: selectedTrack });
      }
    }, 1200);
  };

  const tracks = [
    'General', 
    'Frontend Developer', 
    'Backend Developer', 
    'Full Stack Developer', 
    'Data Scientist', 
    'Product Manager'
  ];

  const socialButtons = [
    { name: 'Google', icon: Globe, color: 'hover:bg-red-500/10 hover:text-red-400' },
    { name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-500/10 hover:text-blue-400' },
    { name: 'GitHub', icon: Github, color: 'hover:bg-white/10 hover:text-white' },
  ];

  return (
    <div className="min-h-screen bg-[#06080f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-indigo-500/50 shadow-2xl mb-4">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Talent<span className="text-indigo-400">Scope</span></h1>
          <p className="text-white/40 text-sm mt-2">Precision AI Resume Intelligence</p>
        </div>

        <GlassCard className="p-8 space-y-6">
          <div className="flex p-1 bg-white/5 rounded-xl gap-1">
            <button 
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === 'login' ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === 'signup' ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
            >
              Join Free
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-xs text-white/30 lowercase tracking-wider font-medium">
              {mode === 'login' ? 'Access your premium analysis dashboard' : 'Join 20k+ professionals using AI insights'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div 
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Deep Malhotra"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/20"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div 
                  key="track-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Preferred Career Track</label>
                  <div className="relative">
                    <Linkedin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <select 
                      value={selectedTrack}
                      onChange={(e) => setSelectedTrack(e.target.value)}
                      className="w-full bg-[#0b0f1a] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                      {tracks.map(track => (
                        <option key={track} value={track} className="bg-[#0b0f1a]">{track}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                      <ArrowRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deep@mail.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pr-1">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Password</label>
                {mode === 'login' && <button type="button" className="text-[10px] text-indigo-400 font-bold hover:text-indigo-300 transition-colors uppercase tracking-widest">Forgot?</button>}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-indigo-500/50 transition-all focus:ring-1 focus:ring-indigo-500/20"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-2 relative overflow-hidden rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Enter Dashboard' : 'Create Account'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 border-t border-white/5 w-full"></div>
              <span className="relative z-10 bg-[#0b0f1a] px-3 text-[10px] text-white/20 uppercase tracking-widest font-bold">Or continue with</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {socialButtons.map((social) => (
                <button 
                  key={social.name}
                  type="button"
                  onClick={() => onLogin({ name: `${social.name} User`, email: `auth@${social.name.toLowerCase()}.com` })}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-white/5 bg-white/[0.02] transition-all group ${social.color}`}
                >
                  <social.icon size={20} className="transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold uppercase tracking-tight opacity-40 group-hover:opacity-100">{social.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer removed */}
        </GlassCard>
      </motion.div>
    </div>
  );
};
