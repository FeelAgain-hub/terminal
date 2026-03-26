'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  color?: string;
}

export default function MetricCard({ label, value, trend, icon: Icon, color = 'emerald' }: MetricCardProps) {
  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };
  
  const activeColorClass = colorClasses[color] || colorClasses.emerald;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-white/20"
    >
      <div className="flex items-center justify-between">
        <div className={`rounded-lg border p-2 ${activeColorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`text-[10px] font-mono font-bold tracking-widest ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-6">
        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className="absolute -bottom-6 -right-6 h-24 w-24 opacity-5 transition-opacity group-hover:opacity-10">
        <Icon className="h-full w-full" />
      </div>
    </motion.div>
  );
}
