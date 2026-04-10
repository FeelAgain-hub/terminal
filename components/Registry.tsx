'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Clinician {
  id: string;
  name: string;
  spec: string;
  ver: string;
  sessions: number;
  status: string;
  advanced?: boolean;
}

interface RegistryProps {
  clinicians: Clinician[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  FormattedValue: React.FC<{ value: number }>;
}

export default function ClinicianRegistry({ clinicians, searchQuery, setSearchQuery, FormattedValue }: RegistryProps) {
  const filteredClinicians = clinicians.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.spec.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Реєстр Фахівців</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Пошук за ім'ям, ID або спеціалізацією..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]/50 hover:border-white/20 w-64 transition-all duration-200" 
          />
          <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-md bg-white/5 text-[10px] font-mono text-slate-500">
            ЗНАЙДЕНО: <span className="text-[#F59E0B]">{filteredClinicians.length}</span>
          </div>
        </div>
      </div>
      <div className="bg-[#050A15] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-slate-500 uppercase tracking-widest bg-white/5">
            <tr>
              <th className="px-6 py-3 font-medium">Фахівець</th>
              <th className="px-6 py-3 font-medium">Спеціалізація</th>
              <th className="px-6 py-3 font-medium">Верифікація</th>
              <th className="px-6 py-3 font-medium">Сесії</th>
              <th className="px-6 py-3 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredClinicians.map((clinician) => (
              <tr key={clinician.id} className="hover:bg-white/10 transition-all duration-200 cursor-default border-l-2 border-transparent hover:border-[#F59E0B]/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="text-white font-medium">{clinician.name}</div>
                    {clinician.advanced && (
                      <div className="group relative">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00F5FF] drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#050A15] border border-white/10 rounded text-[8px] text-[#00F5FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          Advanced Clinical Verification
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500">{clinician.id}</div>
                </td>
                <td className="px-6 py-4 text-slate-400">{clinician.spec}</td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-[#00FF66] border border-[#00FF66]/30 px-2 py-0.5 rounded bg-[#00FF66]/5">{clinician.ver}</span>
                </td>
                <td className="px-6 py-4 font-mono text-slate-300">
                  <FormattedValue value={clinician.sessions} />
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold ${clinician.status === 'ACTIVE' ? 'text-[#00FF66]' : 'text-slate-500'}`}>{clinician.status}</span>
                </td>
              </tr>
            ))}
            {filteredClinicians.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                  Жодного фахівця не знайдено за вашим запитом
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
