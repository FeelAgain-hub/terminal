'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface FlipNumberProps {
  value: string | number;
  color?: string;
  prefix?: string;
}

export function FlipNumber({ value, color = 'text-white', prefix = '' }: FlipNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <div className={`${color} font-mono text-base md:text-2xl font-bold flex items-center`}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <AnimatePresence mode="wait">
        <motion.span
          key={String(displayValue)}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
