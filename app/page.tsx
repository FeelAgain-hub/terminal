'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Activity, ArrowRight, CheckCircle2, ChevronRight, LayoutDashboard, ShieldCheck, Users, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FormattedValue } from '@/components/FormattedValue';
import { FlipNumber } from '@/components/FlipNumber';
import { INITIAL_TRANSACTIONS, INITIAL_CLINICIANS, SYMPTOM_DATA, OUTCOME_TREND } from '@/lib/data';

import { Language, translations } from '@/lib/translations';

// Dynamic imports for performance optimization
const OutcomesCharts = dynamic(() => import('@/components/Charts').then(mod => mod.OutcomesCharts), {
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />,
  ssr: false
});

const FundingPieChart = dynamic(() => import('@/components/Charts').then(mod => mod.FundingPieChart), {
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />,
  ssr: false
});

const ClinicianRegistry = dynamic(() => import('@/components/Registry'), {
  loading: () => <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-xl" />,
  ssr: false
});

const ClinicianStatsCharts = dynamic(() => import('@/components/Charts').then(mod => mod.ClinicianStatsCharts), {
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />,
  ssr: false
});

export default function Page() {
  const [lang, setLang] = useState<Language>('ua');
  const t = translations[lang];
  const [activeModule, setActiveModule] = useState<'overview' | 'funds' | 'registry' | 'outcomes' | 'compliance'>('funds');
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ledgerPage, setLedgerPage] = useState(1);
  const LEDGER_ITEMS_PER_PAGE = 5;
  
  // New Calculator State
  const [calcBeneficiaries, setCalcBeneficiaries] = useState<number>(1);
  const [calcMixedRate, setCalcMixedRate] = useState<number>(100);
  const [calcPsychologists, setCalcPsychologists] = useState<number>(0);
  const [isSlider1Moved, setIsSlider1Moved] = useState(false);
  const [isSlider2Moved, setIsSlider2Moved] = useState(false);
  const [isAnimatingSlider2, setIsAnimatingSlider2] = useState(false);

  useEffect(() => {
    if (calcPsychologists > 0) {
      setIsAnimatingSlider2(true);
      const timer = setTimeout(() => setIsAnimatingSlider2(false), 800);
      return () => clearTimeout(timer);
    }
  }, [calcPsychologists]);
  
  // Constants from user request
  const TRAINING_GROUP_SIZE = 20;
  const TRAINING_GROUP_COST = 90000;
  const PRO_BONO_HOURS_PER_STUDENT = 150;
  const SESSIONS_PER_BENEFICIARY_INTERNAL = 12; // EMDR & VR
  const SESSIONS_PER_BENEFICIARY_MARKET = 16; // WHO Standard
  const MARKET_HOUR_RATE = 50;
  const MARKET_COURSE_VALUE = SESSIONS_PER_BENEFICIARY_MARKET * MARKET_HOUR_RATE; // 800
  const [metrics, setMetrics] = useState({
    totalPool: 1250000,
    disbursed: 342800,
    activeClinicians: 1402,
    outcomeSuccess: 68.4,
    beneficiaries: 8420,
    clients: 1240,
    patients: 3150,
    processedOrders: 12450,
    riskScore: 0.12,
    automationRate: 42
  });

  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [clinicians] = useState(INITIAL_CLINICIANS);

  const paginatedTransactions = useMemo(() => {
    const start = (ledgerPage - 1) * LEDGER_ITEMS_PER_PAGE;
    return transactions.slice(start, start + LEDGER_ITEMS_PER_PAGE);
  }, [transactions, ledgerPage]);

  const totalLedgerPages = Math.ceil(transactions.length / LEDGER_ITEMS_PER_PAGE);

  // Animate Metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalPool: prev.totalPool + Math.floor(Math.random() * 50),
        disbursed: prev.disbursed + Math.floor(Math.random() * 30),
        activeClinicians: Math.random() > 0.95 ? prev.activeClinicians + 1 : prev.activeClinicians,
        outcomeSuccess: Number((prev.outcomeSuccess + (Math.random() * 0.2 - 0.1)).toFixed(1)),
        beneficiaries: prev.beneficiaries + (Math.random() > 0.8 ? 1 : 0),
        clients: prev.clients + (Math.random() > 0.9 ? 1 : 0),
        patients: prev.patients + (Math.random() > 0.85 ? 1 : 0),
        processedOrders: prev.processedOrders + (Math.random() > 0.5 ? 1 : 0),
        riskScore: Number((Math.max(0.05, Math.min(0.25, prev.riskScore + (Math.random() * 0.02 - 0.01)))).toFixed(2)),
        automationRate: Math.min(100, prev.automationRate + (Math.random() > 0.9 ? 1 : 0))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic Ledger Updates
  useEffect(() => {
    const names = ['Dr. Olena Kovalenko', 'Dr. Serhiy Morozov', 'Dr. Iryna Shevchenko', 'Dr. Dmytro Bondarenko', 'Dr. Anna Lysenko', 'Dr. Natalia Petrenko', 'Dr. Viktor Melnyk'];
    const protocols = ['mhGAP Session 4', 'Bravemind VR', 'PTSD Initial', 'mhGAP Session 1', 'CBT Session 2', 'Crisis Intervention', 'Trauma Processing'];
    const ids = ['UA-MED-8492', 'UA-MED-1104', 'UA-MED-9932', 'UA-MED-3321', 'UA-MED-5542', 'UA-MED-7721', 'UA-MED-4409'];

    const interval = setInterval(() => {
      const newTx = {
        id: `0x${Math.random().toString(16).slice(2, 4)}...${Math.random().toString(16).slice(2, 6)}`,
        doc: ids[Math.floor(Math.random() * ids.length)],
        clinicianName: names[Math.floor(Math.random() * names.length)],
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        amount: `$${(Math.floor(Math.random() * 100) + 40).toFixed(2)}`,
        status: Math.random() > 0.3 ? 'SETTLED' : 'PENDING',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB')
      };

      setTransactions(prev => [newTx, ...prev.slice(0, 3)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = (index: number) => {
    setTransactions(prev => prev.map((tx, i) => {
      if (i === index) {
        return { ...tx, status: tx.status === 'SETTLED' ? 'PENDING' : 'SETTLED' };
      }
      return tx;
    }));
  };

  const simulationResults = useMemo(() => {
    // 1. Calculate added beneficiaries from training
    // 20 psychologists provide 3000 hours, which covers 3000 / 12 = 250 beneficiaries
    const addedBeneficiaries = (calcPsychologists / TRAINING_GROUP_SIZE) * (TRAINING_GROUP_SIZE * PRO_BONO_HOURS_PER_STUDENT / SESSIONS_PER_BENEFICIARY_INTERNAL);
    const totalBeneficiaries = calcBeneficiaries + addedBeneficiaries;
    
    // 2. Calculate actual costs
    const baseCost = calcBeneficiaries * MARKET_COURSE_VALUE;
    const trainingCost = (calcPsychologists / TRAINING_GROUP_SIZE) * TRAINING_GROUP_COST;
    const totalActualCost = baseCost + trainingCost;
    
    // 3. User contribution based on mixed finance slider
    const userContribution = totalActualCost * (calcMixedRate / 100);
    const otherFunding = totalActualCost - userContribution;
    
    // 4. Distribution (Blended Finance)
    const crowdfundingRatio = 0.10;
    const corporateRatio = 0.25;
    const donorsRatio = 0.65;
    
    const crowdfunding = otherFunding * crowdfundingRatio;
    const corporate = otherFunding * corporateRatio;
    const donors = otherFunding * donorsRatio;
    
    // 5. Efficiency
    // Market value is what it would cost to treat everyone at market rates (16 sessions * $50)
    const totalMarketValue = totalBeneficiaries * MARKET_COURSE_VALUE;
    const totalEfficiency = userContribution > 0 ? totalMarketValue / userContribution : 0;
    
    const effectiveCostPerBeneficiary = totalBeneficiaries > 0 ? totalActualCost / totalBeneficiaries : MARKET_COURSE_VALUE;
    
    return {
      totalBeneficiaries,
      userContribution,
      crowdfunding,
      corporate,
      donors,
      totalEfficiency,
      addedBeneficiaries,
      effectiveCostPerBeneficiary,
      totalActualCost,
      totalMarketValue
    };
  }, [calcBeneficiaries, calcMixedRate, calcPsychologists, MARKET_COURSE_VALUE]);

  const clinicianStats = useMemo(() => {
    const specCounts: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};

    clinicians.forEach(c => {
      const specMap: Record<string, string> = {
        'PTSD / Trauma': t.ptsdTrauma,
        'CBT / Anxiety': t.cbtAnxiety,
        'Child Psychology': t.childPsych,
        'Military Rehab': t.militaryRehab,
        'Crisis Intervention': t.crisisIntervention,
        'Addiction Recovery': t.addictionRecovery,
        'Family Therapy': t.familyTherapy,
        'Grief Counseling': t.griefCounseling,
        'Art Therapy': t.artTherapy,
        'Neuropsychology': t.neuropsychology,
        'Group Therapy': t.groupTherapy,
        'Rehabilitation': t.rehabilitation,
        'Clinical Psych': t.clinicalPsych,
      };
      const name = specMap[c.spec] || c.spec;
      specCounts[name] = (specCounts[name] || 0) + 1;

      const statusMap: Record<string, string> = {
        'ACTIVE': t.active,
        'ON LEAVE': t.onLeave,
      };
      const statusName = statusMap[c.status] || c.status;
      statusCounts[statusName] = (statusCounts[statusName] || 0) + 1;
    });

    const specData = Object.entries(specCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const statusData = Object.entries(statusCounts)
      .map(([name, value]) => ({ name, value }));

    return { specData, statusData };
  }, [clinicians, t]);

  // Sync metrics with simulation
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      totalPool: simulationResults.totalMarketValue,
      disbursed: simulationResults.totalActualCost,
      beneficiaries: Math.round(simulationResults.totalBeneficiaries)
    }));
  }, [simulationResults]);

  return (
    <main className="min-h-screen bg-[#02040A] text-slate-300 font-sans selection:bg-[#F59E0B] selection:text-[#050A15]">
      <div className="h-screen flex flex-col bg-[#02040A]">
        {/* Terminal Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-[#050A15]">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00F5FF] shadow-[0_0_8px_#00F5FF]" />
              <span className="text-white font-mono text-xs md:text-sm tracking-tighter">FA_TERMINAL_v1.0</span>
            </div>
            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Status: Live</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Network: Secure</div>
              <div className="text-[10px] font-mono text-slate-600 uppercase">Last Updated: 2026-03-25 11:12:41</div>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-mono text-slate-400">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-md overflow-hidden">
              <button 
                onClick={() => setLang('en')}
                className={`px-2 py-1 transition-all ${lang === 'en' ? 'bg-[#F59E0B] text-[#050A15] font-bold' : 'hover:bg-white/5'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('ua')}
                className={`px-2 py-1 transition-all ${lang === 'ua' ? 'bg-[#F59E0B] text-[#050A15] font-bold' : 'hover:bg-white/5'}`}
              >
                UA
              </button>
            </div>
            <span className="hidden sm:inline">UPTIME: <span className="text-[#00F5FF]">99.9%</span></span>
            <span>REGION: <span className="text-[#00F5FF]">UA_WEST</span></span>
          </div>
        </header>

        {/* Terminal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Hidden on small mobile, scrollable on others */}
          <aside className="hidden md:flex w-64 border-r border-white/10 bg-[#050A15]/50 p-4 flex-col gap-2 overflow-y-auto">
            <div className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4 px-2">{lang === 'en' ? 'Modules' : 'Модулі'}</div>
            {[
              { id: 'funds', icon: Wallet, label: t.contribution },
              { id: 'overview', icon: LayoutDashboard, label: t.overview },
              { id: 'registry', icon: Users, label: t.registry },
              { id: 'outcomes', icon: Activity, label: t.outcomes },
              { id: 'compliance', icon: ShieldCheck, label: t.compliance },
            ].map((mod) => (
              <button 
                key={mod.id}
                onClick={() => setActiveModule(mod.id as 'overview' | 'funds' | 'registry' | 'outcomes' | 'compliance')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  activeModule === mod.id 
                    ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/10 border-transparent'
                }`}
              >
                <mod.icon className="w-4 h-4" /> {mod.label}
              </button>
            ))}
          </aside>

          {/* Mobile Nav - Visible only on small screens */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050A15] border-t border-white/10 z-50 flex justify-around p-2">
            {[
              { id: 'funds', icon: Wallet },
              { id: 'overview', icon: LayoutDashboard },
              { id: 'registry', icon: Users },
              { id: 'outcomes', icon: Activity },
              { id: 'compliance', icon: ShieldCheck },
            ].map((mod) => (
              <button 
                key={mod.id}
                onClick={() => setActiveModule(mod.id as 'overview' | 'funds' | 'registry' | 'outcomes' | 'compliance')}
                className={`p-2 rounded-lg transition-all ${
                  activeModule === mod.id ? 'text-[#F59E0B] bg-[#F59E0B]/10' : 'text-slate-500'
                }`}
              >
                <mod.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {activeModule === 'overview' && (
                <>
                  {/* Top Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-[#050A15] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[120px]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{t.totalPool}</div>
                        <motion.div 
                          key={metrics.totalPool}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className="text-xl md:text-2xl lg:text-3xl font-mono text-[#00F5FF] truncate"
                        >
                          <FormattedValue value={metrics.totalPool} type="currency" />
                        </motion.div>
                        <div className="text-[#00FF66] text-[10px] mt-2 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 -rotate-45" /> +$250k {t.thisMonth}
                        </div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[120px]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{t.disbursed}</div>
                        <motion.div 
                          key={metrics.disbursed}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className="text-xl md:text-2xl lg:text-3xl font-mono text-[#00F5FF] truncate"
                        >
                          <FormattedValue value={metrics.disbursed} type="currency" />
                        </motion.div>
                        <div className="text-slate-400 text-[10px] mt-2">{t.directToClinicians}</div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[120px]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{t.activeClinicians}</div>
                        <motion.div 
                          key={metrics.activeClinicians}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className="text-xl md:text-2xl lg:text-3xl font-mono text-[#00F5FF] truncate"
                        >
                          <FormattedValue value={metrics.activeClinicians} />
                        </motion.div>
                        <div className="text-slate-400 text-[10px] mt-2">{t.verifiedVia}</div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[120px]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">{t.therapySuccess}</div>
                        <motion.div 
                          key={metrics.outcomeSuccess}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className="text-xl md:text-2xl lg:text-3xl font-mono text-[#00F5FF] truncate"
                        >
                          <FormattedValue value={metrics.outcomeSuccess} type="percent" />
                        </motion.div>
                        <div className="text-slate-400 text-[10px] mt-2">{t.ptsdReduction}</div>
                      </div>
                    </div>

                  {/* Live Ledger */}
                  <div className="bg-[#050A15] border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                      <h2 className="text-xs font-bold text-white uppercase tracking-widest">{t.liveLedger}</h2>
                      <div className="flex items-center gap-2 text-xs text-[#00FF66]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                        {t.syncing}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm table-fixed min-w-[600px]">
                        <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-white/5">
                          <tr>
                            <th className="px-6 py-3 font-medium w-1/4">{t.txId}</th>
                            <th className="px-6 py-3 font-medium w-1/4">{t.clinicianId}</th>
                            <th className="px-6 py-3 font-medium w-1/4">{t.protocol}</th>
                            <th className="px-6 py-3 font-medium w-1/6">{t.amount}</th>
                            <th className="px-6 py-3 font-medium w-1/6">{t.status}</th>
                          </tr>
                        </thead>
                        <AnimatePresence initial={false}>
                          {paginatedTransactions.map((tx, i) => (
                            <motion.tbody 
                              key={tx.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="divide-y divide-white/5 font-mono"
                            >
                              <motion.tr 
                                layout
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className={`hover:bg-white/5 transition-colors cursor-pointer group h-[60px] ${expandedTxId === tx.id ? 'bg-white/5' : ''}`}
                                onClick={() => setExpandedTxId(expandedTxId === tx.id ? null : tx.id)}
                              >
                                <td className="px-6 py-4 text-slate-400 truncate">{tx.id}</td>
                                <td className="px-6 py-4 text-white truncate">{tx.doc}</td>
                                <td className="px-6 py-4 text-slate-300 truncate">{tx.protocol}</td>
                                <td className="px-6 py-4 text-[#00F5FF]">{tx.amount}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${
                                      tx.status === 'SETTLED' ? 'bg-[#00FF66]/10 text-[#00FF66]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                                    }`}>
                                      <AnimatePresence mode="wait">
                                        {tx.status === 'SETTLED' ? (
                                          <motion.div
                                            key="settled"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                          >
                                            <CheckCircle2 className="w-3 h-3" />
                                          </motion.div>
                                        ) : (
                                          <motion.div
                                            key="pending"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin"
                                          />
                                        )}
                                      </AnimatePresence>
                                      {tx.status === 'SETTLED' ? t.settled : t.pending}
                                    </span>
                                    <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${expandedTxId === tx.id ? 'rotate-90' : ''}`} />
                                  </div>
                                </td>
                              </motion.tr>
                              <AnimatePresence>
                                {expandedTxId === tx.id && (
                                  <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                  >
                                    <td colSpan={5} className="p-0 border-b border-white/5">
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-[#F59E0B]/5"
                                      >
                                        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-4 gap-4 md:gap-8">
                                          <div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.clinicianName}</div>
                                            <div className="text-white font-sans font-medium text-xs">{tx.clinicianName}</div>
                                          </div>
                                          <div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.clinicianId}</div>
                                            <div className="text-white font-mono text-xs">{tx.doc}</div>
                                          </div>
                                          <div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.timestamp}</div>
                                            <div className="text-slate-300 text-xs">{tx.date} <span className="text-slate-500">@</span> {tx.time}</div>
                                          </div>
                                          <div className="flex items-end justify-start sm:justify-end">
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStatus(i);
                                              }}
                                              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-white/10 rounded-md hover:bg-white/10 transition-colors"
                                            >
                                              {t.toggleStatus}
                                            </button>
                                          </div>
                                        </div>
                                      </motion.div>
                                    </td>
                                  </motion.tr>
                                )}
                              </AnimatePresence>
                            </motion.tbody>
                          ))}
                        </AnimatePresence>
                      </table>
                    </div>
                    
                    {/* Ledger Pagination */}
                    {totalLedgerPages > 1 && (
                      <div className="px-6 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                          {t.page} <span className="text-white">{ledgerPage}</span> {t.of} <span className="text-white">{totalLedgerPages}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setLedgerPage(prev => Math.max(1, prev - 1))}
                            disabled={ledgerPage === 1}
                            className="p-1 rounded border border-white/10 bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setLedgerPage(prev => Math.min(totalLedgerPages, prev + 1))}
                            disabled={ledgerPage === totalLedgerPages}
                            className="p-1 rounded border border-white/10 bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                    {/* Protocol Compliance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-[#050A15] border border-white/10 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-[#F59E0B]" />
                          {t.monitoringControl}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.beneficiaries}</div>
                            <div className="text-xl font-bold text-[#00F5FF]">
                              <FormattedValue value={metrics.beneficiaries} />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.patients}</div>
                            <div className="text-xl font-bold text-[#00F5FF]">
                              <FormattedValue value={metrics.patients} />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.clients}</div>
                            <div className="text-xl font-bold text-[#00F5FF]">
                              <FormattedValue value={metrics.clients} />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.processedOrders}</div>
                            <div className="text-xl font-bold text-[#00F5FF]">
                              <FormattedValue value={metrics.processedOrders} />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.riskScore}</div>
                            <div className="text-xl font-bold text-[#00FF66]">{metrics.riskScore}</div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.automationRate}</div>
                            <div className="text-xl font-bold text-[#F59E0B]">{metrics.automationRate}%</div>
                          </div>
                        </div>
                        <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">AI/ML Analytics</span>
                            <span className="text-[#00FF66]">ACTIVE</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">Blockchain Transparency</span>
                            <span className="text-[#00FF66]">VERIFIED</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">Anomalies Detected</span>
                            <span className="text-white">0</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">NLP Interface</span>
                            <span className="text-[#F59E0B]">READY</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#050A15] border border-white/10 rounded-xl p-6 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-4 bg-white/5">
                          <ShieldCheck className="w-8 h-8 text-[#00FF66]" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{t.systemIntegrity}</h3>
                        <p className="text-sm text-slate-400 max-w-sm">
                          {t.integrityDesc}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeModule === 'funds' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white uppercase tracking-widest">{t.impactCalculator}</h2>
                    </div>

                    {/* New Calculator UI */}
                    <div className="bg-[#050A15] border border-white/10 p-3 md:p-8 rounded-2xl space-y-4 md:space-y-8 relative overflow-hidden">
                      
                      {/* Sticky Results Header for Mobile/Desktop */}
                      <div className="sticky top-0 z-20 bg-[#050A15]/95 backdrop-blur-md py-2 md:py-4 -mx-3 px-3 md:-mx-8 md:px-8 border-b border-white/5 mb-2 md:mb-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                          <motion.div 
                            animate={isAnimatingSlider2 ? { scale: [1, 1.02, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,245,255,0.4)', 'rgba(255,255,255,0.1)'] } : {}}
                            transition={{ duration: 0.4 }}
                            className="bg-white/5 border border-white/10 p-2 md:p-4 rounded-xl flex flex-col items-center justify-center text-center group transition-all hover:border-[#00F5FF]/30"
                          >
                            <div className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">{t.coverage}</div>
                            <div className="flex items-center gap-1">
                              <div className="text-base md:text-2xl font-mono font-bold text-[#00F5FF]">
                                {Math.round(simulationResults.totalBeneficiaries)}
                              </div>
                              <motion.div 
                                whileTap={{ scale: 0.8, rotate: -12 }} 
                                whileHover={{ scale: 1.1, color: '#00F5FF' }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="cursor-pointer"
                              >
                                <Users className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-600 transition-colors" />
                              </motion.div>
                            </div>
                          </motion.div>

                          <div className="bg-white/5 border border-white/10 p-2 md:p-4 rounded-xl flex flex-col items-center justify-center text-center group transition-all hover:border-[#F59E0B]/30">
                            <div className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">{t.contributionAmount}</div>
                            <div className="flex items-center gap-1 w-full justify-center overflow-hidden">
                              <span className="text-xs md:text-xl font-mono font-bold text-white">€</span>
                              <input 
                                type="number" 
                                value={Math.round(simulationResults.userContribution)}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 0;
                                  const trainingCost = (calcPsychologists / TRAINING_GROUP_SIZE) * TRAINING_GROUP_COST;
                                  const remainingForBase = (val / (calcMixedRate / 100)) - trainingCost;
                                  const newBaseBeneficiaries = Math.max(0, Math.floor(remainingForBase / MARKET_COURSE_VALUE));
                                  setCalcBeneficiaries(newBaseBeneficiaries);
                                }}
                                className="bg-transparent text-sm md:text-2xl font-mono font-bold text-white w-full max-w-[60px] md:max-w-[120px] text-center focus:outline-none focus:text-[#F59E0B] shrink"
                              />
                              <motion.div 
                                whileTap={{ scale: 0.8, rotate: 12 }} 
                                whileHover={{ scale: 1.1, color: '#F59E0B' }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="cursor-pointer shrink-0"
                              >
                                <Wallet className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-600 transition-colors" />
                              </motion.div>
                            </div>
                          </div>

                          <motion.div 
                            animate={isAnimatingSlider2 ? { scale: [1, 1.05, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,255,102,0.5)', 'rgba(255,255,255,0.1)'] } : {}}
                            transition={{ duration: 0.4 }}
                            className={`bg-white/5 border border-white/10 p-2 md:p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-500 ${isSlider2Moved ? 'opacity-100 border-[#00FF66]/30' : 'opacity-30 grayscale'}`}
                          >
                            <div className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">{t.trainingPsychologists}</div>
                            <div className="flex items-center gap-1">
                              <span className="text-base md:text-2xl font-mono font-bold text-white">
                                {calcPsychologists}
                              </span>
                              <span className="text-[7px] md:text-[9px] font-bold text-slate-500 uppercase">{t.psych}</span>
                            </div>
                          </motion.div>

                          <motion.div 
                            animate={isAnimatingSlider2 ? { scale: [1, 1.02, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,255,102,0.4)', 'rgba(255,255,255,0.1)'] } : {}}
                            transition={{ duration: 0.4 }}
                            className="bg-white/5 border border-white/10 p-2 md:p-4 rounded-xl flex flex-col items-center justify-center text-center group transition-all hover:border-[#00FF66]/30"
                          >
                            <div className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">{t.courseCost}</div>
                            <div className="flex items-center gap-1">
                              <span className="text-base md:text-2xl font-mono font-bold text-[#00FF66]">
                                €{Math.round(simulationResults.effectiveCostPerBeneficiary)}
                              </span>
                              <div className="text-[6px] md:text-[8px] text-slate-500 font-bold uppercase">/ {t.perPerson}</div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Sliders Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
                        <div className="space-y-2 md:space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.mixedFinanceLabel}</label>
                            <span className="text-xs font-mono text-[#F59E0B] font-bold">{calcMixedRate}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="15" 
                            max="100" 
                            step="1"
                            value={calcMixedRate}
                            onChange={(e) => {
                              setCalcMixedRate(parseInt(e.target.value));
                              setIsSlider1Moved(true);
                            }}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                          />
                          <p className="hidden md:block text-[10px] text-slate-500 leading-relaxed italic">
                            {t.mixedDesc}
                          </p>
                        </div>

                        <div className="space-y-2 md:space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.trainingPsychologists}</label>
                            <span className="text-xs font-mono text-[#00FF66] font-bold">{calcPsychologists}</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="200" 
                            step="20"
                            value={calcPsychologists}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (val > 0 && calcPsychologists === 0) {
                                setCalcBeneficiaries(0);
                              }
                              setCalcPsychologists(val);
                              setIsSlider2Moved(true);
                              setCalcMixedRate(100); // Reset slider 1
                            }}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF66]"
                          />
                          <p className="hidden md:block text-[10px] text-slate-500 leading-relaxed italic">
                            {t.trainingDesc}
                          </p>
                          <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-[#00F5FF] uppercase tracking-widest hover:underline">
                            {lang === 'en' ? 'Learn More' : 'Докладніше'} <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Blocks */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                      {[
                        { 
                          name: t.crowdfunding, 
                          value: isSlider1Moved ? simulationResults.crowdfunding : 125000, 
                          color: isSlider1Moved ? 'text-[#F59E0B]' : 'text-[#00F5FF]',
                          shouldFlip: isSlider1Moved
                        },
                        { 
                          name: t.corporate, 
                          value: isSlider1Moved ? simulationResults.corporate : 350000, 
                          color: isSlider1Moved ? 'text-[#F59E0B]' : 'text-[#00F5FF]',
                          shouldFlip: isSlider1Moved
                        },
                        { 
                          name: t.donors, 
                          value: isSlider1Moved ? simulationResults.donors : 900000, 
                          color: isSlider1Moved ? 'text-[#F59E0B]' : 'text-[#00F5FF]',
                          shouldFlip: isSlider1Moved
                        },
                        { 
                          name: t.resourceEfficiency, 
                          value: simulationResults.totalEfficiency.toFixed(2) + 'x', 
                          color: (isSlider1Moved || isSlider2Moved) ? 'text-[#F59E0B]' : 'text-[#00F5FF]',
                          shouldFlip: isSlider1Moved || isSlider2Moved
                        },
                      ].map((donor, idx) => {
                        const isEfficiencyBlock = idx === 3;
                        return (
                          <motion.div 
                            key={donor.name} 
                            animate={isAnimatingSlider2 && isEfficiencyBlock ? { scale: [1, 1.03, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,245,255,0.4)', 'rgba(255,255,255,0.1)'] } : {}}
                            transition={{ duration: 0.4 }}
                            className="bg-[#050A15] border border-white/10 p-3 md:p-6 rounded-xl flex flex-col justify-between min-h-[100px] md:min-h-[140px] transition-all hover:bg-white/5"
                          >
                            <div className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-2 md:mb-4">{donor.name}</div>
                            <div className="flex flex-col">
                              {donor.shouldFlip ? (
                                <FlipNumber 
                                  value={typeof donor.value === 'number' ? Math.round(donor.value).toLocaleString() : donor.value} 
                                  color={donor.color}
                                  prefix={typeof donor.value === 'number' ? '€' : ''}
                                />
                              ) : (
                                <div className={`${donor.color} font-mono text-base md:text-2xl font-bold`}>
                                  {typeof donor.value === 'number' ? (
                                    <FormattedValue value={donor.value} type="currency" currency="EUR" />
                                  ) : (
                                    donor.value
                                  )}
                                </div>
                              )}
                              <div className="text-[7px] md:text-[10px] text-slate-600 mt-1 md:mt-2 uppercase font-bold tracking-tighter">
                                {idx === 3 ? t.calculatedMetric : t.resourceAllocation}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Funding Breakdown Visualization */}
                    <div className="bg-[#050A15] border border-white/10 p-6 md:p-8 rounded-2xl">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/2 h-[300px] relative">
                          <FundingPieChart 
                            data={[
                              { name: t.crowdfunding, value: simulationResults.crowdfunding },
                              { name: t.corporate, value: simulationResults.corporate },
                              { name: t.donors, value: simulationResults.donors },
                              { name: t.userFunds, value: simulationResults.userContribution },
                            ]} 
                            totalActualCost={simulationResults.totalActualCost} 
                            lang={lang}
                          />
                        </div>
                        
                        <div className="w-full md:w-1/2 space-y-4">
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">{t.fundingStructure}</h3>
                          {[
                            { name: t.crowdfunding, color: 'bg-[#F59E0B]', value: simulationResults.crowdfunding },
                            { name: t.corporate, color: 'bg-[#00F5FF]', value: simulationResults.corporate },
                            { name: t.donors, color: 'bg-[#00FF66]', value: simulationResults.donors },
                            { name: t.userFunds, color: 'bg-[#475569]', value: simulationResults.userContribution },
                          ].map((item) => (
                            <div key={item.name} className="flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{item.name}</span>
                              </div>
                              <div className="text-xs font-mono text-white font-bold">
                                {((item.value / simulationResults.totalActualCost) * 100).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] text-slate-500 italic leading-relaxed">
                              {t.blendedDesc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeModule === 'registry' && (
                      <ClinicianRegistry 
                        clinicians={clinicians} 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                        FormattedValue={FormattedValue} 
                        lang={lang}
                      />
                    )}
                {activeModule === 'outcomes' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white uppercase tracking-widest">{t.clinicalOutcomes}</h2>
                      <div className="text-[10px] font-mono text-slate-500">{t.realTimeClinicalData}</div>
                    </div>

                    <OutcomesCharts symptomData={SYMPTOM_DATA} outcomeTrend={OUTCOME_TREND} lang={lang} />
                    
                    <div className="pt-8 border-t border-white/5">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#00F5FF]" />
                          {t.clinicianWorkforce}
                        </h3>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">{t.dataSource}</div>
                      </div>
                      <ClinicianStatsCharts specData={clinicianStats.specData} statusData={clinicianStats.statusData} lang={lang} />
                    </div>
                    
                    {/* Key Performance Indicators */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">{t.protocolCompletion}</div>
                        <div className="text-2xl font-mono font-bold text-[#00F5FF]">84.2%</div>
                        <div className="text-[8px] text-[#00FF66] mt-1 uppercase font-bold tracking-tighter">+2.4% {t.thisMonth}</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">{t.avgSessions}</div>
                        <div className="text-2xl font-mono font-bold text-[#00F5FF]">12.4</div>
                        <div className="text-[8px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">{t.mhpStandard}</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">{t.retentionRate}</div>
                        <div className="text-2xl font-mono font-bold text-[#00F5FF]">91%</div>
                        <div className="text-[8px] text-[#00FF66] mt-1 uppercase font-bold tracking-tighter">{t.highEngagement}</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">{t.waitTime}</div>
                        <div className="text-2xl font-mono font-bold text-[#00F5FF]">4.2d</div>
                        <div className="text-[8px] text-[#00FF66] mt-1 uppercase font-bold tracking-tighter">{t.optimizedFlow}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule === 'compliance' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">{t.complianceAudit}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#050A15] border border-white/10 p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{t.reportingStandards}</h3>
                        <div className="space-y-4">
                          {[
                            { label: t.grandBargain, status: t.pass },
                            { label: t.localization, status: '34.2%', color: '#00F5FF' },
                            { label: t.iatiStandard, status: t.synced },
                            { label: t.mhgapProtocols, status: t.verified },
                            { label: t.automatedReporting, status: t.activeStatus },
                          ].map((check) => (
                            <div key={check.label} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                              <div className="text-xs font-medium text-white">{check.label}</div>
                              <span className={`text-[10px] font-bold ${check.color ? `text-[${check.color}]` : 'text-[#00FF66]'}`} style={check.color ? { color: check.color } : {}}>{check.status}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg">
                          <div className="text-[10px] text-[#F59E0B] font-bold uppercase tracking-widest mb-2">{t.securityEngine}</div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            {t.securityDesc}
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{t.integrityChecks}</h3>
                        <div className="space-y-4">
                          {[
                            { label: t.identityVerification, status: t.pass, time: `2${t.minutesAgo}` },
                            { label: t.smartContractAudit, status: t.pass, time: `14${t.hoursAgo}` },
                            { label: t.dataEncryption, status: t.activeStatus, time: t.continuous },
                            { label: t.gdprHipaa, status: t.verified, time: t.monthly },
                          ].map((check) => (
                            <div key={check.label} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                              <div>
                                <div className="text-xs font-medium text-white">{check.label}</div>
                                <div className="text-[10px] text-slate-500">{check.time}</div>
                              </div>
                              <span className="text-[10px] font-bold text-[#00FF66]">{check.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{t.auditLogs}</h3>
                        <div className="space-y-3 font-mono text-[10px]">
                          <div className="text-slate-400">[16:02:11] <span className="text-[#F59E0B]">INFO</span>: {t.blockVerified}. Tx: 0x8f...3b2a</div>
                          <div className="text-slate-400">[15:58:45] <span className="text-[#00FF66]">{t.pass}</span>: {t.identityVerification} Dr. Kovalenko (UA-MED-8492)</div>
                          <div className="text-slate-400">[15:45:30] <span className="text-[#A855F7]">{t.synced}</span>: {t.totalPoolUpdated} (+$250,000)</div>
                          <div className="text-slate-400">[15:30:12] <span className="text-[#F59E0B]">WARN</span>: {t.latencySpike} (34ms)</div>
                          <div className="text-slate-400">[15:10:05] <span className="text-[#F59E0B]">INFO</span>: {t.newSession}: PTSD Initial</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </main>
          </div>

          {/* Terminal Footer */}
          <footer className="px-6 py-4 border-t border-white/10 bg-[#050A15] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              © 2025 Foundation Open Society. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <button className="hover:text-white transition-colors">{t.cookieSettings}</button>
              <button className="hover:text-white transition-colors">{t.cookieStatement}</button>
              <button className="hover:text-white transition-colors">{t.privacyPolicy}</button>
              <button className="hover:text-white transition-colors">{t.disclaimer}</button>
            </div>
          </footer>
        </div>
      </main>
    );
  }
