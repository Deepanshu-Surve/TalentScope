import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Target, 
  ChevronRight,
  CircleDot,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { GlassCard, Badge } from './UI';

interface RoadmapViewProps {
  roadmap: {
    title: string;
    description: string;
    duration: string;
    milestones: {
      title: string;
      description: string;
    }[];
  };
  onBack: () => void;
}

export const RoadmapView = ({ roadmap, onBack }: RoadmapViewProps) => {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </button>

      <div className="space-y-12">
        {/* Title Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
             <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
               Career Path
             </Badge>
             <div className="flex items-center gap-2 text-xs text-white/30">
               <Clock size={12} />
               <span>{roadmap.duration} Estimate</span>
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {roadmap.title}
          </h1>
          <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
            {roadmap.description}
          </p>
        </div>

        {/* Roadmap Visual */}
        <div className="relative mt-16 px-2">
          {/* Main vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-px bg-linear-to-b from-indigo-500/50 via-purple-500/50 to-transparent" />

          <div className="space-y-12">
            {roadmap.milestones.map((milestone, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-8 ${
                  i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Connector Dot */}
                <div className="absolute left-4 sm:left-1/2 top-2 sm:top-1/2 -translate-x-1/2 sm:-translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#0b0f1a] border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <span className="text-[10px] font-black text-indigo-400">{i + 1}</span>
                  </div>
                </div>

                {/* Content Card */}
                <div className="w-full sm:w-[calc(50%-2.5rem)] ml-12 sm:ml-0">
                  <GlassCard className="p-6 hover:border-indigo-500/30 transition-all group">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {milestone.title}
                        </h3>
                        {i === 0 ? (
                           <Badge className="bg-indigo-500/20 text-indigo-400">Current Step</Badge>
                        ) : (
                           <CheckCircle2 size={16} className="text-white/10" />
                        )}
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed">
                        {milestone.description}
                      </p>
                      
                      <div className="pt-4 flex items-center justify-between border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                           <Calendar size={12} />
                           <span>Week {Math.ceil((i + 1) * 1.5)}</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Empty side for layout on desktop */}
                <div className="hidden sm:block sm:w-[calc(50%-2.5rem)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
