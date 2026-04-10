'use client';

import { motion } from 'motion/react';

interface BigNumberProps {
  value: string;
  label: string;
  delay?: number;
}

export default function BigNumber({ value, label, delay = 0 }: BigNumberProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="relative p-8 border border-white/10 bg-white/5 backdrop-blur-sm"
    >
      <div className="text-7xl font-bold tracking-tighter mb-2 terminal-glow">
        {value}
      </div>
      <div className="text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </div>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
    </motion.div>
  );
}
