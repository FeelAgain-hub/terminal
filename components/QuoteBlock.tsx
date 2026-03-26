'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

interface QuoteBlockProps {
  quote: string;
  author: string;
  title: string;
}

export default function QuoteBlock({ quote, author, title }: QuoteBlockProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur-sm text-center"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#050A15] p-3">
          <Quote className="h-6 w-6 text-emerald-400" />
        </div>
        <blockquote className="text-2xl font-medium leading-relaxed text-white sm:text-3xl">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="mt-8">
          <p className="text-lg font-bold text-emerald-400">{author}</p>
          <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">{title}</p>
        </div>
      </motion.div>
    </section>
  );
}
