'use client';

import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FactCheckProps {
  fact: string;
  source: string;
  delay?: number;
}

export default function FactCheck({ fact, source, delay = 0 }: FactCheckProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="p-6 border border-white/10 bg-white/5 flex gap-6 items-start"
    >
      <div className="p-2 bg-white/5">
        <CheckCircle2 className="w-5 h-5 text-white/40" />
      </div>
      <div className="space-y-4">
        <p className="text-lg font-medium leading-relaxed text-white/80">
          {fact}
        </p>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/20">
          <AlertCircle className="w-3 h-3" />
          Source: {source}
        </div>
      </div>
    </motion.div>
  );
}
