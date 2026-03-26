'use client';

import React from 'react';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface DashboardLinkProps {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export default function DashboardLink({ label, title, description, icon: Icon, href }: DashboardLinkProps) {
  return (
    <a 
      href={href}
      className="group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-lg border border-white/10 bg-white/5 p-2 transition-colors group-hover:border-emerald-500/30 group-hover:bg-emerald-500/20">
          <Icon className="h-6 w-6 text-slate-400 transition-colors group-hover:text-emerald-400" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-slate-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-400" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">{label}</span>
        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-emerald-400">{title}</h3>
        <p className="text-sm text-slate-400 transition-colors group-hover:text-slate-300">{description}</p>
      </div>
    </a>
  );
}
