/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileUp, 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Search,
  Zap,
  TrendingUp,
  CircleDot,
  Loader2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { RoadmapView } from './components/RoadmapView';
import { LoginView } from './components/LoginView';
import { GlassCard, Badge } from './components/UI';
import { analyzeResume, AnalysisResult } from './services/geminiService';
import { extractTextFromPDF } from './lib/pdfExtractor';
import { HistoryItem, AppSettings } from './types';
import { generateAnalysisPDF } from './services/pdfService';
import { Download } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  targetRole: 'General',
  analysisMode: 'basic',
  apiKey: '',
  displayPreferences: {
    showAtsBreakdown: true,
    showSuggestions: true,
    showSkillGap: true,
  },
  userProfile: {
    name: 'Candidate',
    email: 'user@example.com',
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('talent_scope_auth') === 'true';
  });
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [isLanding, setIsLanding] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'done'>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<{
    title: string;
    description: string;
    duration: string;
    milestones: { title: string; description: string; }[];
  } | null>(null);

  const mainRef = useRef<HTMLElement>(null);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('talent_scope_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('talent_scope_settings', JSON.stringify(settings));
    // Apply theme (though app is dark by default, we can add a light class if needed)
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [settings]);

  // Scroll to top on tab change or roadmap view change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Reset roadmap when switching away from Dashboard tab via BottomNav
    if (currentTab !== 'Dashboard') {
      setActiveRoadmap(null);
    }
  }, [currentTab, isLanding, activeRoadmap]);

  const handleStart = () => {
    if (isAuthenticated) {
      setIsLanding(false);
      setIsLoggingIn(false);
      setCurrentTab('Upload Resume');
    } else {
      setIsLoggingIn(true);
    }
  };

  const handleLogin = (user: { name: string; email: string; targetRole?: string }) => {
    setIsAuthenticated(true);
    setSettings(prev => ({
      ...prev,
      userProfile: { name: user.name, email: user.email },
      targetRole: user.targetRole || prev.targetRole
    }));
    localStorage.setItem('talent_scope_auth', 'true');
    setIsLoggingIn(false);
    setIsLanding(false);
    setCurrentTab('Upload Resume');
  };

  const handleLogout = () => {
    localStorage.removeItem('talent_scope_auth');
    setIsAuthenticated(false);
    setIsLanding(true);
    setIsLoggingIn(false);
    setCurrentTab('Dashboard');
    setAnalysisResult(null);
  };

  const saveToHistory = (result: AnalysisResult, fName: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      fileName: fName,
      date: new Date().toISOString(),
      atsScore: result.atsScore,
      role: result.jobMatches[0]?.role || "General",
      analysis: result
    };

    const saved = localStorage.getItem('talent_scope_history');
    const history: HistoryItem[] = saved ? JSON.parse(saved) : [];
    localStorage.setItem('talent_scope_history', JSON.stringify([newItem, ...history]));
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
       setError("Please upload a PDF file.");
       return;
    }
    
    setError(null);
    setFileName(file.name);
    setUploadStatus('uploading');
    setProgress(0);
    
    try {
      // Step 1: Extract Text
      const text = await extractTextFromPDF(file);
      setProgress(50);
      
      setUploadStatus('analyzing');
      
      // Step 2: Analyze with Gemini
      const result = await analyzeResume(text, { 
        apiKey: settings.apiKey, 
        targetRole: settings.targetRole,
        analysisMode: settings.analysisMode
      });
      setProgress(100);
      
      setAnalysisResult(result);
      setUploadStatus('done');
      
      // Save to history
      saveToHistory(result, file.name);
      
      // Navigate to dashboard after small delay for success feel
      setTimeout(() => {
        setCurrentTab('Dashboard');
      }, 500);

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze resume. Please try again.";
      setError(errorMessage);
      setUploadStatus('idle');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLanding && !isLoggingIn ? (
          <div key="home">
            <HomeView onStart={handleStart} />
          </div>
        ) : isLoggingIn ? (
          <div key="login">
            <LoginView onLogin={handleLogin} />
          </div>
        ) : (
          <div key="app" className="flex h-screen bg-brand-bg transition-colors duration-700 overflow-hidden">
            <Sidebar 
              activeItem={currentTab} 
              onItemChange={setCurrentTab} 
              onLogout={handleLogout}
              userName={settings.userProfile.name}
            />
            
            <div className="flex-1 flex flex-col min-w-0">
              <div className="md:hidden">
                <Navbar 
                  currentTab={currentTab} 
                  onTabChange={setCurrentTab} 
                />
              </div>
            
              <main ref={mainRef} className="flex-1 pt-24 md:pt-12 pb-32 overflow-y-auto w-full">
              <div className="px-4 md:px-8 max-w-7xl mx-auto">
                {currentTab === 'Upload Resume' && (
                  <UploadView 
                    status={uploadStatus} 
                    progress={progress} 
                    onUpload={handleFileUpload}
                    onDrop={handleDrop}
                    error={error}
                    fileName={fileName}
                  />
                )}
                {currentTab === 'Dashboard' && activeRoadmap && (
                  <RoadmapView 
                    roadmap={activeRoadmap} 
                    onBack={() => setActiveRoadmap(null)} 
                  />
                )}
                {currentTab === 'Dashboard' && !activeRoadmap && analysisResult && (
                  <DashboardView result={analysisResult} settings={settings} onViewPath={setActiveRoadmap} />
                )}
                {currentTab === 'Dashboard' && !analysisResult && (
                  <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-white/40">
                    <Search size={48} className="opacity-20" />
                    <p>Upload a resume to see your AI insights</p>
                    <button 
                      onClick={() => setCurrentTab('Upload Resume')}
                      className="gradient-button mt-4"
                    >
                      Upload Now
                    </button>
                  </div>
                )}
                {currentTab === 'History' && (
                  <HistoryView 
                    onView={(item) => {
                      setAnalysisResult(item.analysis);
                      setCurrentTab('Dashboard');
                    }}
                  />
                )}
                {currentTab === 'Settings' && (
                  <SettingsView 
                    settings={settings}
                    onUpdate={setSettings}
                    onClearHistory={() => {
                      localStorage.removeItem('talent_scope_history');
                    }}
                    onLogout={handleLogout}
                  />
                )}
              </div>
              <Footer />
            </main>
          </div>

          <BottomNav activeTab={currentTab} onTabChange={setCurrentTab} />
        </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- VIEWS ---

function HomeView({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20"
    >
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[0.95] md:leading-[0.9] text-white px-2"
        >
          AI Resume Analyzer & <span className="gradient-text">Job Matcher</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed px-4 md:px-0"
        >
          The Insightful Architect for your career. We decode complex job requirements and align your professional narrative with surgical precision.
        </motion.p>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.3 }}
           className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <button onClick={onStart} className="gradient-button w-full md:w-auto">
            Upload Resume
          </button>
          <button className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all w-full md:w-auto flex items-center justify-center gap-2 font-semibold">
            <Play size={16} className="text-indigo-400" />
            Live Demo
          </button>
        </motion.div>

        {/* Trusted Companies */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-16 border-t border-white/5"
        >
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 text-white/50">Trusted by professionals at</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8 grayscale opacity-50">
            <span className="text-xl md:text-2xl font-black italic">LINEAR</span>
            <span className="text-xl md:text-2xl font-black">STRIPE</span>
            <span className="text-xl md:text-2xl font-black">VERCEL</span>
            <span className="text-xl md:text-2xl font-black">OPENAI</span>
            <span className="text-xl md:text-2xl font-black">AIRBNB</span>
          </div>
        </motion.div>
      </div>

      <div className="w-full mt-auto">
        <Footer />
      </div>
    </motion.div>
  );
}

function UploadView({ status, progress, onUpload, onDrop, error, fileName }: { 
  status: string, 
  progress: number, 
  onUpload: (e: any) => void,
  onDrop: (e: any) => void,
  error: string | null,
  fileName: string | null
}) {
  return (
    <div className="max-w-4xl mx-auto pt-12">
      <GlassCard 
        className={`relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 transition-all duration-500 overflow-hidden ${
          error ? 'border-red-500/50' : 'border-white/10 hover:border-indigo-500/50'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="text-center space-y-6">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border shadow-xl transition-colors duration-500 ${
              error ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-500/20'
            }`}
          >
            <FileUp size={40} />
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Upload your Resume</h2>
            <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
              Drag and drop your PDF file here to start the AI analysis. Our insightful architect will parse your experience.
            </p>
          </div>

          <label className="gradient-button inline-flex items-center cursor-pointer">
            CHOOSE FILE
            <input type="file" className="hidden" accept=".pdf" onChange={onUpload} />
          </label>

          {error && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-red-400 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
        </div>

        {status !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-brand-bg/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-12 z-20"
          >
            <GlassCard className="w-full max-w-[calc(100vw-3rem)] sm:max-w-md p-6 sm:p-8 border-white/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                    {status === 'analyzing' ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{fileName}</div>
                    <div className="text-[10px] text-white/40 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${status === 'analyzing' ? 'bg-purple-500' : 'bg-indigo-500'}`} />
                      <span className="truncate">{status === 'uploading' ? 'EXTRACTING TEXT...' : 'ANALYZING RESUME...'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-400 self-end sm:self-auto">{progress}%</div>
              </div>

              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 ${
                    status === 'analyzing' ? 'bg-linear-to-r from-purple-500 to-indigo-500' : 'bg-linear-to-r from-indigo-500 to-indigo-400'
                  }`}
                />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </GlassCard>
      
      <div className="mt-8 flex justify-center gap-12 text-white/30 text-[10px] font-bold tracking-widest uppercase">
        <div className="flex items-center gap-2">
           <Zap size={12} className="text-yellow-500/50" />
           Bank-Level Encryption
        </div>
        <div className="flex items-center gap-2">
           <Zap size={12} className="text-yellow-500/50" />
           Avg. Parse Time: 1.4s
        </div>
      </div>
    </div>
  );
}

function DashboardView({ result, settings, onViewPath }: { 
  result: AnalysisResult, 
  settings: AppSettings,
  onViewPath: (roadmap: any) => void
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 md:px-0">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">Welcome back, {(result?.name || settings?.userProfile?.name || 'Candidate').split(' ')[0]}</h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl leading-relaxed">{result?.summary}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={() => generateAnalysisPDF(result, result?.name || settings?.userProfile?.name || 'Candidate')}
            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm font-bold order-2 sm:order-1"
          >
            <Download size={16} className="text-indigo-400" />
            Download PDF
          </button>
          <button 
             onClick={() => window.location.reload()}
             className="gradient-button text-sm py-3 px-8 flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Sparkles size={16} />
            New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ATS Score & Strength Analysis */}
        <GlassCard className="lg:col-span-2 flex flex-col md:flex-row gap-8 md:gap-12 items-center p-6 md:p-10">
          <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0">
             <svg className="w-full h-full" viewBox="0 0 100 100">
               <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  className="text-white/5"
               />
               <motion.circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="url(#score-grad)" 
                  strokeWidth="8" 
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * result.atsScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
               />
               <defs>
                 <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor={result.atsScore > 75 ? "#10b981" : result.atsScore > 50 ? "#f59e0b" : "#ef4444"} />
                   <stop offset="100%" stopColor="#a855f7" />
                 </linearGradient>
               </defs>
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-4xl font-black">{result.atsScore}</span>
               <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">ATS Score</span>
             </div>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <h3 className="text-xl font-bold">Strength Analysis</h3>
            <div className="space-y-4">
              {settings.displayPreferences.showAtsBreakdown ? (
                <>
                  <StrengthRow label="Keyword Density" value={result.strengthAnalysis.keywordDensity} color="indigo" />
                  <StrengthRow label="Format Compliance" value={result.strengthAnalysis.formatCompliance} color="purple" />
                  <StrengthRow label="Role Relevance" value={result.strengthAnalysis.roleRelevance} color="orange" />
                </>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-white/40 italic">
                  Breakdown hidden in settings.
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Extracted Skills */}
        <GlassCard className="flex flex-col h-full min-h-[300px] md:min-h-0">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={18} className="text-orange-400" />
            <h3 className="text-xl font-bold">Extracted Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-8 content-start flex-1 overflow-y-auto max-h-[250px] md:max-h-[180px] scrollbar-hide">
            {result.skills.map(skill => (
              <span key={skill} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] leading-relaxed text-white/40 italic">
            AI Note: Focus on quantitative metrics instead of task descriptions to boost impact scores.
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Optimization Preview */}
        {settings.displayPreferences.showSuggestions ? (
          <GlassCard className="lg:col-span-2">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold">AI Optimization Preview</h3>
               <Badge className="bg-purple-500/20 text-purple-400">
                 {settings.analysisMode === 'advanced' ? 'Deep Analysis Mode' : 'Standard Mode'}
               </Badge>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                 <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-red-400/60 uppercase">
                   <AlertCircle size={12} />
                   Before (Weak)
                 </div>
                 <p className="text-sm text-white/40 leading-relaxed italic">
                   "{result.optimization.before}"
                 </p>
               </div>
               <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-4 relative">
                 <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
                   <Sparkles size={12} />
                   AI Enhanced (Strong)
                 </div>
                 <p className="text-sm leading-relaxed">
                   "{result.optimization.after}"
                 </p>
                 <div className="absolute top-4 right-4 text-indigo-400">
                    <CheckCircle2 size={16} />
                 </div>
               </div>
             </div>
          </GlassCard>
        ) : (
          <div className="lg:col-span-2 p-12 rounded-3xl border border-white/5 bg-white/2 flex items-center justify-center text-white/20 italic text-sm">
            Optimization preview hidden in settings.
          </div>
        )}

        {/* Skill Gap Analysis */}
        {settings.displayPreferences.showSkillGap ? (
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle size={18} className="text-red-400" />
              <h3 className="text-xl font-bold">Skill Gap Analysis</h3>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-white/40">Critical gaps identified:</p>
              {result.skillGaps.map(gap => (
                <div key={gap} className="flex items-center gap-3 p-3 rounded-xl bg-red-400/5 border border-red-400/10">
                  <AlertCircle size={14} className="text-red-400" />
                  <span className="text-sm font-medium text-red-200/80">{gap}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="flex items-center justify-center text-center p-12">
            <p className="text-xs text-white/20">Skill gap analysis hidden.</p>
          </GlassCard>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Role Matches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xl font-bold">Top Role Matches</h3>
             <ArrowRight size={18} className="text-white/20" />
          </div>
          {result.jobMatches.map((job, i) => (
            <div key={i}>
              <GlassCard className="flex flex-col sm:flex-row sm:items-center justify-between hover:border-indigo-500/30 transition-all cursor-pointer group gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black group-hover:scale-110 transition-transform shrink-0">
                    {job.company[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold truncate">{job.role}</h4>
                    <div className="text-xs text-white/40 truncate">{job.company} • {job.location}</div>
                  </div>
                </div>
                <div className="flex sm:block items-center justify-between sm:text-right border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                  <div className="text-xl sm:text-2xl font-black text-indigo-400">{job.match}%</div>
                  <div className="text-[8px] font-bold tracking-widest uppercase text-white/30">Match</div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Upskilling Roadmap */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold px-2">Upskilling Roadmap</h3>
          <GlassCard className="flex-1 space-y-8 relative overflow-hidden">
            {/* Thread line */}
            <div className="absolute left-[31px] top-12 bottom-12 w-px bg-white/10" />
            
            {result.roadmap.map((step, i) => (
              <div key={i} className="flex gap-6 relative z-10 group">
                <div className="mt-1">
                  <div className={`w-3 h-3 rounded-full border-2 transition-all ${i === 0 ? 'bg-indigo-500 border-indigo-400' : 'bg-brand-bg border-white/20'}`} />
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{step.title}</h5>
                  <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                  <div 
                    onClick={() => onViewPath(step)}
                    className="text-[10px] font-bold text-indigo-400/60 transition-colors border-b border-indigo-500/20 inline-block cursor-pointer hover:text-indigo-400"
                  >
                    {step.duration} • View Path
                  </div>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function StrengthRow({ label, value, color }: { label: string, value: number, color: string }) {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-400 shadow-indigo-500/50',
    purple: 'from-purple-500 to-purple-400 shadow-purple-500/50',
    orange: 'from-orange-500 to-orange-400 shadow-orange-500/50',
  }[color as 'indigo' | 'purple' | 'orange'];

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full bg-linear-to-r ${colors} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
}

