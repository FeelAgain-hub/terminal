'use client';

import React from 'react';
import { motion } from 'motion/react';

interface BigNumberProps {
  number: string;
  label: string;
  description?: string;
}

export default function BigNumber({ number, label, description }: BigNumberProps) {
  return (
    <div className="flex flex-col gap-2">
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-6xl font-bold tracking-tighter text-white sm:text-8xl"
      >
        {number}
      </motion.span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest">{label}</span>
        {description && <span className="text-xs text-slate-500">{description}</span>}
      </div>
    </div>
  );
}
