import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Zap, 
  Eye, 
  Trash2, 
  Mail, 
  Briefcase,
  Key,
  CheckCircle2,
  Moon,
  Sun,
  Layout,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { GlassCard, Badge } from './UI';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
  onClearHistory: () => void;
  onLogout: () => void;
}

export const SettingsView = ({ settings, onUpdate, onClearHistory, onLogout }: SettingsViewProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'layout' | 'ai'>('profile');
  const [showKey, setShowKey] = useState(false);

  const updateSetting = (key: string, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  const updatePreference = (key: keyof AppSettings['displayPreferences'], value: boolean) => {
    onUpdate({
      ...settings,
      displayPreferences: {
        ...settings.displayPreferences,
        [key]: value
      }
    });
  };

  const updateProfile = (key: keyof AppSettings['userProfile'], value: string) => {
    onUpdate({
      ...settings,
      userProfile: {
        ...settings.userProfile,
        [key]: value
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Settings</h1>
          <p className="text-white/40 mt-1">Configure your AI preferences and account details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation / Sidebar Tabs */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 gap-2 scrollbar-hide snap-x">
           <SettingNavButton 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')}
              icon={User} 
              label="Profile" 
           />
           <SettingNavButton 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')}
              icon={Shield} 
              label="Security" 
           />
           <SettingNavButton 
              active={activeTab === 'layout'} 
              onClick={() => setActiveTab('layout')}
              icon={Layout} 
              label="Layout" 
           />
           <SettingNavButton 
              active={activeTab === 'ai'} 
              onClick={() => setActiveTab('ai')}
              icon={Zap} 
              label="AI Engine" 
           />
        </div>

        <div className="md:col-span-2 min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.section 
                key="profile"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 px-2">
                  <User size={16} className="text-indigo-400" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Profile Information</h3>
                </div>
                <GlassCard className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Display Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input 
                          type="text" 
                          value={settings.userProfile.name}
                          onChange={(e) => updateProfile('name', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Email Address</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input 
                          type="email" 
                          value={settings.userProfile.email}
                          onChange={(e) => updateProfile('email', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Preferred Career Track</label>
                      <div className="relative">
                        <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <select 
                          value={['General', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager'].includes(settings.targetRole) ? settings.targetRole : 'Other'}
                          onChange={(e) => {
                            if (e.target.value !== 'Other') {
                              updateSetting('targetRole', e.target.value);
                            } else {
                              updateSetting('targetRole', ''); // Reset to allow typing
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
                        >
                          <option value="General" className="bg-[#0b0f1a]">General Professional</option>
                          <option value="Frontend Developer" className="bg-[#0b0f1a]">Frontend Developer</option>
                          <option value="Backend Developer" className="bg-[#0b0f1a]">Backend Developer</option>
                          <option value="Full Stack Developer" className="bg-[#0b0f1a]">Full Stack Developer</option>
                          <option value="Data Scientist" className="bg-[#0b0f1a]">Data Scientist</option>
                          <option value="Product Manager" className="bg-[#0b0f1a]">Product Manager</option>
                          <option value="Other" className="bg-[#0b0f1a]">Other (Custom Role)...</option>
                        </select>
                      </div>
                    </div>

                    {!['General', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager'].includes(settings.targetRole) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <label className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest pl-1">Specify Custom Role</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Lead Mobile Engineer"
                          value={settings.targetRole}
                          onChange={(e) => updateSetting('targetRole', e.target.value)}
                          className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                      </motion.div>
                    )}
                  </div>
                </GlassCard>
                <p className="text-[10px] text-white/20 px-2 italic">These details are used to personalize your analysis summaries.</p>
              </motion.section>
            )}

            {activeTab === 'security' && (
              <motion.section 
                key="security"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 px-2">
                  <Shield size={16} className="text-green-400" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Security & Privacy</h3>
                </div>
                <GlassCard className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Gemini API Token</div>
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
                      >
                        {showKey ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                    <div className="relative">
                      <Key size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input 
                        type={showKey ? "text" : "password"} 
                        value={settings.apiKey}
                        onChange={(e) => updateSetting('apiKey', e.target.value)}
                        placeholder="Enter your personal Gemini API key..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-mono focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                      {settings.apiKey && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-white/30 italic">Your key is stored locally and never sent to our servers. Enter a valid Gemini API key to avoid analysis failures.</p>
                  </div>
                </GlassCard>
              </motion.section>
            )}

            {activeTab === 'layout' && (
              <motion.section 
                key="layout"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 px-2">
                  <Layout size={16} className="text-indigo-400" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Dashboard Layout</h3>
                </div>
                <GlassCard className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">ATS Score Breakdown</div>
                      <div className="text-xs text-white/40">Show detailed percentages for keywords and relevance.</div>
                    </div>
                    <Toggle 
                       active={settings.displayPreferences.showAtsBreakdown} 
                       onToggle={() => updatePreference('showAtsBreakdown', !settings.displayPreferences.showAtsBreakdown)} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">AI Optimization Suggestions</div>
                      <div className="text-xs text-white/40">Display the 'Before/After' comparison card.</div>
                    </div>
                    <Toggle 
                       active={settings.displayPreferences.showSuggestions} 
                       onToggle={() => updatePreference('showSuggestions', !settings.displayPreferences.showSuggestions)} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">Skill Gap Indicators</div>
                      <div className="text-xs text-white/40">Highlight missing skills in red on dashboards.</div>
                    </div>
                    <Toggle 
                       active={settings.displayPreferences.showSkillGap} 
                       onToggle={() => updatePreference('showSkillGap', !settings.displayPreferences.showSkillGap)} 
                    />
                  </div>
                </GlassCard>
              </motion.section>
            )}

            {activeTab === 'ai' && (
              <motion.section 
                key="ai"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 px-2">
                  <Zap size={16} className="text-yellow-400" />
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em]">AI Intelligence Mode</h3>
                </div>
                <GlassCard className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold">Advanced Analysis (Gemini 1.5 Pro)</div>
                      <div className="text-xs text-white/40">Slower but provides deeper semantic insight and better summaries.</div>
                    </div>
                    <Toggle 
                       active={settings.analysisMode === 'advanced'} 
                       onToggle={() => updateSetting('analysisMode', settings.analysisMode === 'advanced' ? 'basic' : 'advanced')} 
                    />
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-white/40 leading-relaxed italic">
                    Note: Advanced mode requires a valid API key for consistent performance during peak usage times.
                  </div>
                </GlassCard>
              </motion.section>
            )}
          </AnimatePresence>
          
          <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-2 px-2">
              <AlertCircle size={16} className="text-red-400" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-red-400">Danger Zone</h3>
            </div>
            <GlassCard className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-red-500/10">
               <div className="p-4 space-y-3">
                 <div className="text-sm font-bold">Clear All History</div>
                 <p className="text-xs text-white/30 tracking-tight leading-relaxed">Permanently delete all your previous resume analysis records and iterations.</p>
                 <button 
                   onClick={onClearHistory}
                   className="w-full py-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 text-[10px] font-bold transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                 >
                   <Trash2 size={12} />
                   Clear History
                 </button>
               </div>
               <div className="p-4 space-y-3">
                 <div className="text-sm font-bold">Session Termination</div>
                 <p className="text-xs text-white/30 tracking-tight leading-relaxed">Securely log out of your current session and clear local authorization tokens.</p>
                 <button 
                    onClick={onLogout}
                    className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <LogOut size={12} />
                    Termination Login
                  </button>
               </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingNavButton = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-shrink-0 md:flex-shrink-1 w-auto md:w-full flex items-center justify-between px-6 md:px-4 py-3 rounded-xl transition-all snap-start ${
      active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {active && <motion.div layoutId="setting-indicator" className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
  </button>
);

const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
  <button 
    onClick={onToggle}
    className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${active ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}
  >
    <motion.div 
      initial={false}
      animate={{ x: active ? 26 : 2 }}
      className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-md"
    />
  </button>
);
