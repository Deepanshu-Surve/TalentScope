import { motion } from "motion/react";
import { Sparkles, Menu, X } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar = ({ currentTab, onTabChange }: NavbarProps) => {
  const tabs = ["Dashboard", "Upload Resume", "History", "Settings"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-[#0b0f1a]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-indigo-500/50 shadow-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Talent<span className="text-indigo-400">Scope</span></span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative text-sm font-medium transition-colors ${
              currentTab === tab ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab}
            {currentTab === tab && (
              <motion.div
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full border border-white/10 p-0.5 overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="Avatar" 
            className="w-full h-full rounded-full bg-indigo-900/30"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </nav>
  );
};
