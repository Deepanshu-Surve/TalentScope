import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Trash2, 
  Eye, 
  Filter, 
  Calendar, 
  Briefcase, 
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Split,
  X,
  FileText
} from 'lucide-react';
import { GlassCard, Badge } from './UI';
import { HistoryItem } from '../types';

interface HistoryViewProps {
  onView: (item: HistoryItem) => void;
}

export const HistoryView = ({ onView }: HistoryViewProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  
  // Selection for comparison
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('talent_scope_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('talent_scope_history', JSON.stringify(newHistory));
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    saveHistory(newHistory);
    // Also remove from selection if present
    setSelectedForCompare(prev => prev.filter(sid => sid !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      saveHistory([]);
      setSelectedForCompare([]);
    }
  };

  const toggleCompareSelection = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(sid => sid !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const roles = ["All", ...Array.from(new Set(history.map(h => h.role)))];

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'All' || item.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.atsScore - a.atsScore;
    });

  const compareData = isComparing && selectedForCompare.length === 2 ? {
    item1: history.find(h => h.id === selectedForCompare[0])!,
    item2: history.find(h => h.id === selectedForCompare[1])!
  } : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Analysis History</h1>
          <p className="text-white/40 mt-1">Manage and compare your previous resume iterations.</p>
        </div>
        <div className="flex gap-3">
          {selectedForCompare.length === 2 && (
            <button 
              onClick={() => setIsComparing(true)}
              className="gradient-button text-xs py-2 px-6 flex items-center gap-2"
            >
              <Split size={16} />
              Compare Resumes
            </button>
          )}
          {history.length > 0 && (
            <button 
              onClick={clearAll}
              className="px-6 py-2 rounded-full border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs font-bold transition-all"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" 
            placeholder="Search by filename or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
          <button 
            onClick={() => setSortBy('date')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'date' ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            Latest
          </button>
          <button 
            onClick={() => setSortBy('score')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${sortBy === 'score' ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            Best Score
          </button>
        </div>

        <select 
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
        >
          {roles.map(r => <option key={r} value={r} className="bg-[#0b0f1a]">{r}</option>)}
        </select>
      </GlassCard>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.map((item, index) => (
          <GlassCard key={item.id} delay={index * 0.05} className="group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <FileText size={20} />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleCompareSelection(item.id)}
                  className={`p-2 rounded-lg transition-all ${selectedForCompare.includes(item.id) ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-white/40 hover:text-indigo-400'}`}
                  title="Select for comparison"
                >
                  <Split size={14} />
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold truncate" title={item.fileName}>{item.fileName}</h3>
                <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest mt-1">
                  <Calendar size={10} />
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-white/20" />
                  <span className="text-xs font-medium text-white/60">{item.role}</span>
                </div>
                <div className="text-lg font-black text-indigo-400">{item.atsScore}%</div>
              </div>

              <button 
                onClick={() => onView(item)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-indigo-500/10 text-white/60 hover:text-indigo-400 text-xs font-bold transition-all border border-transparent hover:border-indigo-500/20 flex items-center justify-center gap-2"
              >
                <Eye size={14} />
                View Analysis
              </button>
            </div>
            
            {selectedForCompare.includes(item.id) && (
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black shadow-lg">
                {selectedForCompare.indexOf(item.id) + 1}
              </div>
            )}
          </GlassCard>
        ))}

        {filteredHistory.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 text-white/20">
            <AlertCircle size={48} className="opacity-20" />
            <p className="text-lg font-medium">No iterations found in history.</p>
            <p className="text-sm max-w-xs mx-auto italic">Start by uploading your resume to see your progressive AI improvements here.</p>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {isComparing && compareData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-bg/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 overflow-y-auto"
          >
            <div className="w-full max-w-5xl space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-indigo-500/10 text-indigo-400 mb-2">Side-by-Side Analysis</Badge>
                  <h2 className="text-3xl font-black italic">Iteration <span className="text-indigo-400">Comparison</span></h2>
                </div>
                <button 
                  onClick={() => setIsComparing(false)}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {[compareData.item1, compareData.item2].map((item, i) => (
                  <GlassCard key={item.id} className={`h-full border-2 ${i === 1 && item.atsScore > compareData.item1.atsScore ? 'border-green-500/30' : 'border-white/10'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Version {i + 1}</div>
                        <h3 className="text-xl font-bold">{item.fileName}</h3>
                        <div className="text-xs text-white/40 italic">{item.role}</div>
                      </div>
                      <div className="text-4xl font-black text-indigo-400">{item.atsScore}%</div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                           <TrendingUp size={12} className="text-indigo-400" />
                           Core Metrics
                        </div>
                        <div className="space-y-3">
                          <CompBar label="Keywords" value={item.analysis.strengthAnalysis.keywordDensity} />
                          <CompBar label="formatting" value={item.analysis.strengthAnalysis.formatCompliance} />
                          <CompBar label="Relevance" value={item.analysis.strengthAnalysis.roleRelevance} />
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-4">Skills Extracted</div>
                        <div className="flex flex-wrap gap-2">
                          {item.analysis.skills.map(skill => (
                            <span key={skill} className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-medium border border-white/5">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 text-xs text-white/50 italic leading-relaxed">
                        "{item.analysis.summary}"
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                 <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-center max-w-lg">
                    <p className="text-sm font-medium mb-1">
                      {compareData.item2.atsScore > compareData.item1.atsScore 
                        ? `Improvement identified! Version 2 scored ${compareData.item2.atsScore - compareData.item1.atsScore}% higher.` 
                        : "Focus on adding more industry-specific keywords to improve Version 2."}
                    </p>
                    <p className="text-[10px] text-white/40 italic">AI Comparison Logic active | v4.0.1 Stable</p>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CompBar = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px]">
      <span className="text-white/40">{label}</span>
      <span className="font-bold text-white/80">{value}%</span>
    </div>
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-indigo-500 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);
