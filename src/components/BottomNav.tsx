import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileUp, 
  History, 
  Settings 
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: "Dashboard", icon: LayoutDashboard, label: "Home" },
    { id: "Upload Resume", icon: FileUp, label: "Analyze" },
    { id: "History", icon: History, label: "History" },
    { id: "Settings", icon: Settings, label: "Profile" }
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[calc(100%-2rem)] sm:max-w-md md:hidden">
      <div className="bg-[#0b101d]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 flex items-center justify-between shadow-2xl shadow-indigo-500/20">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 py-3 px-4 sm:px-6 rounded-xl transition-all grow ${
                isActive ? 'text-indigo-400' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-indigo-500/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon size={20} className={isActive ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
