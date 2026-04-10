'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subValue?: string;
  delay?: number;
}

export default function MetricCard({ icon: Icon, label, value, subValue, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group p-6 border border-white/10 hover:border-white/30 transition-colors bg-white/5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-white/5 rounded-sm">
          <Icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-white/20">
          Status: Active
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-widest text-white/40">
          {label}
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {value}
        </div>
        {subValue && (
          <div className="text-[10px] text-white/20 font-mono">
            {subValue}
          </div>
        )}
      </div>
    </motion.div>
  );
}
