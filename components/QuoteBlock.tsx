'use client';

import { motion } from 'motion/react';

interface QuoteBlockProps {
  quote: string;
  author: string;
  delay?: number;
}

export default function QuoteBlock({ quote, author, delay = 0 }: QuoteBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 1 }}
      className="p-12 border-l border-white/20 bg-gradient-to-r from-white/5 to-transparent"
    >
      <div className="text-3xl font-light italic leading-relaxed text-white/80 mb-8">
        &ldquo;{quote}&rdquo;
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-[1px] bg-white/40" />
        <div className="text-xs uppercase tracking-[0.3em] text-white/40">
          {author}
        </div>
      </div>
    </motion.div>
  );
}
