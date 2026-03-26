'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FlipNumberProps {
  value: string | number;
  color?: string;
  prefix?: string;
  suffix?: string;
}

export const FlipNumber = ({ value, color = 'text-[#00F5FF]', prefix = '', suffix = '' }: FlipNumberProps) => {
  return (
    <div className="overflow-hidden flex items-baseline justify-center">
      {prefix && <span className={`${color} font-mono text-sm mr-1 opacity-70`}>{prefix}</span>}
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`${color} font-mono text-xl md:text-2xl font-bold tabular-nums`}
        >
          {value}
        </motion.div>
      </AnimatePresence>
      {suffix && <span className={`${color} font-mono text-sm ml-1 opacity-70`}>{suffix}</span>}
    </div>
  );
};
