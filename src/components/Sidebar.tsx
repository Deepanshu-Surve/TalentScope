import React from 'react';
import { 
  LayoutDashboard, 
  FileUp, 
  History, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
  onLogout: () => void;
  userName: string;
}

export const Sidebar = ({ activeItem, onItemChange, onLogout, userName }: SidebarProps) => {
  const menuItems = [
    { id: "Dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "Upload Resume", icon: FileUp, label: "Analyze Resume" },
    { id: "History", icon: History, label: "History" },
    { id: "Settings", icon: Settings, label: "Settings" }
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-[#0b0f1a]/50 border-r border-white/5 h-screen sticky top-0 p-6 z-40">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-indigo-500/50 shadow-lg">
          <Sparkles size={22} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Talent<span className="text-indigo-400">Scope</span></span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-indigo-400' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
        <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Signed in as</div>
          <div className="text-sm font-bold truncate">{userName}</div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-bold"
        >
          <LogOut size={18} />
          Logout Session
        </button>
      </div>
    </aside>
  );
};
