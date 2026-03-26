'use client';

import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FactCheckProps {
  claim: string;
  isVerified: boolean;
  source?: string;
}

export default function FactCheck({ claim, isVerified, source }: FactCheckProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className={`mt-1 rounded-full p-1 transition-colors duration-500 ${isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
        <AnimatePresence mode="wait">
          {isVerified ? (
            <motion.div
              key="verified-icon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircle2 className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="review-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <AlertCircle className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-white">{claim}</p>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.span 
              key={isVerified ? 'verified' : 'review'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              {isVerified ? 'VERIFIED' : 'UNDER REVIEW'}
            </motion.span>
          </AnimatePresence>
          {source && (
            <>
              <span className="text-[10px] text-slate-600">•</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">SOURCE: {source}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
