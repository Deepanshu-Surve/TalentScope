import { motion, HTMLMotionProps } from "motion/react";
import React from "react";
import { LucideIcon } from "lucide-react";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard = ({ children, className = "", delay = 0, ...props }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-4 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ children, className = "" }: BadgeProps) => {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/10 border border-white/20 text-white/70 ${className}`}>
      {children}
    </span>
  );
}

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  label: string;
  color?: string;
}

export const StatCard = ({ icon: Icon, title, value, label, color = "indigo" }: StatCardProps) => {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400`}>
          <Icon size={18} />
        </div>
        <h3 className="text-sm font-medium text-white/60">{title}</h3>
      </div>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs text-white/40 mt-1">{label}</div>
      </div>
    </GlassCard>
  );
};
