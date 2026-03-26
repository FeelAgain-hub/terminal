'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FormattedValue } from './FormattedValue';

import { Language, translations } from '@/lib/translations';

interface SymptomData {
  name: string;
  before: number;
  after: number;
}

interface OutcomeTrend {
  month: string;
  success: number;
}

interface FundingData {
  name: string;
  value: number;
}

export const OutcomesCharts = ({ symptomData, outcomeTrend, lang }: { symptomData: SymptomData[], outcomeTrend: OutcomeTrend[], lang: Language }) => {
  const t = translations[lang];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#050A15] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{t.symptomReduction}</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={symptomData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#02040A] border border-white/10 p-3 rounded-lg shadow-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">{payload[0].payload.name}</p>
                        <div className="space-y-1">
                          <p className="text-xs text-[#F59E0B]">{t.before}: <span className="font-mono font-bold">{payload[0].value}</span></p>
                          <p className="text-xs text-[#00FF66]">{t.after}: <span className="font-mono font-bold">{payload[1].value}</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="before" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="after" fill="#00FF66" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#050A15] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{t.outcomeTrend}</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={outcomeTrend}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00F5FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
                domain={[60, 85]}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#02040A] border border-white/10 p-3 rounded-lg shadow-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{payload[0].payload.month}</p>
                        <p className="text-sm font-mono font-bold text-[#00F5FF]">{payload[0].value}% {t.success}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="success" 
                stroke="#00F5FF" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSuccess)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const FundingPieChart = ({ data, totalActualCost, lang }: { data: FundingData[], totalActualCost: number, lang: Language }) => {
  const t = translations[lang];
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {[
              { color: '#F59E0B' }, // Crowdfunding
              { color: '#00F5FF' }, // Corporate
              { color: '#00FF66' }, // Donors
              { color: '#475569' }, // User Funds
            ].map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#02040A] border border-white/10 p-3 rounded-lg shadow-2xl z-50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{payload[0].name}</p>
                    <p className="text-sm font-mono font-bold text-white">
                      <FormattedValue value={Number(payload[0].value)} type="currency" currency="EUR" />
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">{t.total}</div>
        <div className="text-xs md:text-lg font-bold text-white font-mono whitespace-nowrap">
          <FormattedValue value={totalActualCost} type="currency" currency="EUR" />
        </div>
      </div>
    </div>
  );
};

interface ClinicianStat {
  name: string;
  value: number;
}

export const ClinicianStatsCharts = ({ specData, statusData, lang }: { specData: ClinicianStat[], statusData: ClinicianStat[], lang: Language }) => {
  const t = translations[lang];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#050A15] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{t.specializationDist}</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={specData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#02040A] border border-white/10 p-3 rounded-lg shadow-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{payload[0].payload.name}</p>
                        <p className="text-sm font-mono font-bold text-[#00F5FF]">{payload[0].value} {t.specialists}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#00F5FF" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#050A15] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{t.workforceStatus}</h3>
        <div className="h-[300px] w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={10}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'ACTIVE' ? '#00FF66' : '#475569'} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#02040A] border border-white/10 p-3 rounded-lg shadow-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{payload[0].name === 'ACTIVE' ? t.active : t.onLeave}</p>
                        <p className="text-sm font-mono font-bold text-white">{payload[0].value} {t.specialists}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{t.total}</div>
            <div className="text-xl font-bold text-white font-mono">
              {statusData.reduce((acc, curr) => acc + curr.value, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
