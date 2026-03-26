'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Activity, Shield, Heart, Users } from 'lucide-react';

export default function FlowDiagram() {
  const steps = [
    { icon: Shield, label: "PROTECTION", color: "emerald" },
    { icon: Activity, label: "ASSESSMENT", color: "cyan" },
    { icon: Heart, label: "RECOVERY", color: "indigo" },
    { icon: Users, label: "RESILIENCE", color: "rose" },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 md:flex-row md:gap-4">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="group relative flex flex-col items-center gap-4"
          >
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10`}>
              <step.icon className="h-8 w-8 text-emerald-400" />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">
              {step.label}
            </span>
          </motion.div>
          {i < steps.length - 1 && (
            <div className="hidden h-px w-12 bg-white/10 md:block" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
