'use client';

import { motion } from 'motion/react';
import { ArrowRight, Activity, Zap, Shield } from 'lucide-react';

export default function FlowDiagram() {
  const steps = [
    { icon: Activity, label: 'Detection', color: 'text-white/40' },
    { icon: Zap, label: 'Analysis', color: 'text-white/60' },
    { icon: Shield, label: 'Response', color: 'text-white' },
  ];

  return (
    <div className="flex items-center justify-between p-12 border border-white/10 bg-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={`p-4 bg-white/5 rounded-full ${step.color}`}>
              <step.icon className="w-6 h-6" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              {step.label}
            </div>
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: 'auto' }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.1, duration: 0.8 }}
              className="flex items-center"
            >
              <ArrowRight className="w-4 h-4 text-white/10" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
