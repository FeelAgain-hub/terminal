'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Activity, ArrowRight, CheckCircle2, ChevronRight, LayoutDashboard, ShieldCheck, Users, Wallet, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FormattedValue } from '@/components/FormattedValue';
import { FlipNumber } from '@/components/FlipNumber';
import { INITIAL_TRANSACTIONS, INITIAL_CLINICIANS, SYMPTOM_DATA, OUTCOME_TREND } from '@/lib/data';

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

export default function Page() {
  const [activeModule, setActiveModule] = useState<'overview' | 'funds' | 'registry' | 'outcomes' | 'compliance' | 'nbu'>('nbu');
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Calculator State
  const [calcBeneficiaries, setCalcBeneficiaries] = useState<number>(1);
  const [calcMixedRate, setCalcMixedRate] = useState<number>(100);
  const [calcPsychologists, setCalcPsychologists] = useState<number>(0);
  const [isSlider1Moved, setIsSlider1Moved] = useState(false);
  const [isSlider2Moved, setIsSlider2Moved] = useState(false);
  const [isAnimatingSlider2, setIsAnimatingSlider2] = useState(false);
  const [fallbackLevel, setFallbackLevel] = useState<number | null>(null);

  useEffect(() => {
    // Fetch metrics from our new fallback API
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        if (data && data.level) {
          setFallbackLevel(data.level);
          // Optionally update base metrics with real data if needed
          // setMetrics(prev => ({ ...prev, disbursed: data.paid, beneficiaries: data.sessions }));
        }
      })
      .catch(err => console.error("Failed to fetch metrics:", err));
  }, []);

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
    <main className="min-h-screen bg-[#0F2B46] text-slate-300 font-sans selection:bg-[#D4A017] selection:text-[#0F2B46]">
      <div className="h-screen flex flex-col bg-[#0F2B46]">
        {/* Terminal Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-[#050A15]">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <img src="/FEEL_logo_dark.svg" alt="FEEL Again" className="h-6 w-auto" />
            </div>
            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] animate-pulse" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Status: Live</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Network: Secure</div>
              <div className="text-[10px] font-mono text-slate-600 uppercase">Last Updated: 2026-03-25 11:12:41</div>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-mono text-slate-400">
            <span className="hidden sm:inline">DATA SOURCE: <span className="text-[#D4A017]">{fallbackLevel ? `LEVEL ${fallbackLevel}` : 'SYNCING...'}</span></span>
            <span className="hidden sm:inline">UPTIME: <span className="text-[#2A9D8F]">99.9%</span></span>
            <span>REGION: <span className="text-[#D4A017]">UA_WEST</span></span>
          </div>
        </header>

        {/* Terminal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Hidden on small mobile, scrollable on others */}
          <aside className="hidden md:flex w-64 border-r border-white/10 bg-[#050A15]/50 p-4 flex-col gap-2 overflow-y-auto">
            <div className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-4 px-2">Modules</div>
            {[
              { id: 'nbu', icon: Landmark, label: 'NBU Economic Index' },
              { id: 'funds', icon: Wallet, label: 'Contribution' },
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'registry', icon: Users, label: 'Clinician Registry' },
              { id: 'outcomes', icon: Activity, label: 'Clinical Outcomes' },
              { id: 'compliance', icon: ShieldCheck, label: 'Compliance' },
            ].map((mod) => (
              <button 
                key={mod.id}
                onClick={() => setActiveModule(mod.id as 'overview' | 'funds' | 'registry' | 'outcomes' | 'compliance' | 'nbu')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  activeModule === mod.id 
                    ? 'bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20 shadow-[0_0_10px_rgba(212,160,23,0.1)]' 
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
              { id: 'nbu', icon: Landmark },
              { id: 'funds', icon: Wallet },
              { id: 'overview', icon: LayoutDashboard },
              { id: 'registry', icon: Users },
              { id: 'outcomes', icon: Activity },
              { id: 'compliance', icon: ShieldCheck },
            ].map((mod) => (
              <button 
                key={mod.id}
                onClick={() => setActiveModule(mod.id as 'overview' | 'funds' | 'registry' | 'outcomes' | 'compliance' | 'nbu')}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 ${
                  activeModule === mod.id ? 'text-[#D4A017] bg-[#D4A017]/10' : 'text-slate-500 hover:text-slate-300'
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
                      <div className="bg-[#050A15] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[120px] transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(0,245,255,0.03)]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Загальний Пул</div>
                        <motion.div 
                          key={metrics.totalPool}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className="text-xl md:text-2xl lg:text-3xl font-mono text-[#D4A017] truncate"
                        >
                          <FormattedValue value={metrics.totalPool} type="currency" />
                        </motion.div>
                        <div className="text-[#2A9D8F] text-[10px] mt-2 flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 -rotate-45" /> +$250k this month
                        </div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[120px] transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(0,245,255,0.03)]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Виплачено</div>
                        <motion.div 
                          key={metrics.disbursed}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className="text-xl md:text-2xl lg:text-3xl font-mono text-[#D4A017] truncate"
                        >
                          <FormattedValue value={metrics.disbursed} type="currency" />
                        </motion.div>
                        <div className="text-slate-400 text-[10px] mt-2">Direct to clinicians</div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[120px] transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(0,245,255,0.03)]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Бенефіціари</div>
                        <motion.div 
                          key={metrics.beneficiaries}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className="text-xl md:text-2xl lg:text-3xl font-mono text-[#D4A017] truncate"
                        >
                          <FormattedValue value={metrics.beneficiaries} />
                        </motion.div>
                        <div className="text-slate-400 text-[10px] mt-2">Total treated</div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-4 rounded-xl flex flex-col justify-between min-h-[120px] transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(0,245,255,0.03)]">
                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Активні Фахівці</div>
                        <motion.div 
                          key={metrics.activeClinicians}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          className="text-xl md:text-2xl lg:text-3xl font-mono text-[#D4A017] truncate"
                        >
                          <FormattedValue value={metrics.activeClinicians} />
                        </motion.div>
                        <div className="text-slate-400 text-[10px] mt-2">Verified via Diia / НСЗУ</div>
                      </div>
                    </div>

                  {/* Live Ledger */}
                  <div className="bg-[#050A15] border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                      <h2 className="text-xs font-bold text-white uppercase tracking-widest">Live Transaction Ledger</h2>
                      <div className="flex items-center gap-2 text-xs text-[#2A9D8F]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] animate-pulse" />
                        SYNCING
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm table-fixed min-w-[600px]">
                        <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-white/5">
                          <tr>
                            <th className="px-6 py-3 font-medium w-1/4">Tx Hash</th>
                            <th className="px-6 py-3 font-medium w-1/4">Clinician ID</th>
                            <th className="px-6 py-3 font-medium w-1/4">Protocol</th>
                            <th className="px-6 py-3 font-medium w-1/6">Amount</th>
                            <th className="px-6 py-3 font-medium w-1/6">Status</th>
                          </tr>
                        </thead>
                        <AnimatePresence initial={false}>
                          {transactions.map((tx, i) => (
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
                                className={`hover:bg-white/10 transition-all duration-200 cursor-pointer group h-[60px] border-l-2 border-transparent hover:border-[#00F5FF]/30 ${expandedTxId === tx.id ? 'bg-white/10 border-l-[#00F5FF]' : ''}`}
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
                                      {tx.status}
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
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Clinician Name</div>
                                            <div className="text-white font-sans font-medium text-xs">{tx.clinicianName}</div>
                                          </div>
                                          <div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Clinician ID</div>
                                            <div className="text-white font-mono text-xs">{tx.doc}</div>
                                          </div>
                                          <div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Timestamp</div>
                                            <div className="text-slate-300 text-xs">{tx.date} <span className="text-slate-500">@</span> {tx.time}</div>
                                          </div>
                                          <div className="flex items-end justify-start sm:justify-end">
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStatus(i);
                                              }}
                                              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-white/10 rounded-md hover:bg-white/10 hover:border-[#F59E0B]/50 hover:text-white transition-all duration-200 active:scale-95"
                                            >
                                              Toggle Status
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
                  </div>

                    {/* Protocol Compliance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-[#050A15] border border-white/10 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-[#F59E0B]" />
                          Monitoring & Control
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(0,245,255,0.02)]">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Пацієнти</div>
                            <div className="text-xl font-bold text-[#00F5FF]">
                              <FormattedValue value={metrics.patients} />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(0,245,255,0.02)]">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Клієнти</div>
                            <div className="text-xl font-bold text-[#00F5FF]">
                              <FormattedValue value={metrics.clients} />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(0,245,255,0.02)]">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Processed Orders</div>
                            <div className="text-xl font-bold text-[#00F5FF]">
                              <FormattedValue value={metrics.processedOrders} />
                            </div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(0,255,102,0.02)]">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Risk Score</div>
                            <div className="text-xl font-bold text-[#00FF66]">{metrics.riskScore}</div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(245,158,11,0.02)] col-span-2">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Automation Rate</div>
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
                        <h3 className="text-lg font-bold text-white mb-2">System Integrity: Verified</h3>
                        <p className="text-sm text-slate-400 max-w-sm">
                          All active clinicians are cross-referenced with НСЗУ registry and Diia. Smart contracts automatically block payments to unverified actors.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeModule === 'funds' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white uppercase tracking-widest">Калькулятор Впливу</h2>
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
                            <div className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">Охоплення</div>
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
                            <div className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">Сума внеску</div>
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
                            <div className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">Train for Care</div>
                            <div className="flex items-center gap-1">
                              <span className="text-base md:text-2xl font-mono font-bold text-white">
                                {calcPsychologists}
                              </span>
                              <span className="text-[7px] md:text-[9px] font-bold text-slate-500 uppercase">Псих.</span>
                            </div>
                          </motion.div>

                          <motion.div 
                            animate={isAnimatingSlider2 ? { scale: [1, 1.02, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,255,102,0.4)', 'rgba(255,255,255,0.1)'] } : {}}
                            transition={{ duration: 0.4 }}
                            className="bg-white/5 border border-white/10 p-2 md:p-4 rounded-xl flex flex-col items-center justify-center text-center group transition-all hover:border-[#00FF66]/30"
                          >
                            <div className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5 md:mb-2">Вартість курсу</div>
                            <div className="flex items-center gap-1">
                              <span className="text-base md:text-2xl font-mono font-bold text-[#00FF66]">
                                €{Math.round(simulationResults.effectiveCostPerBeneficiary)}
                              </span>
                              <div className="text-[6px] md:text-[8px] text-slate-500 font-bold uppercase">/ чол</div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Sliders Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
                        <div className="space-y-2 md:space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Смешанное финансирование</label>
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
                            Ви можете приєднатися до пулу донорів, де ваш внесок буде доповнено ресурсами фондів та корпорацій. При 15% власного фінансування ви отримуєте повний звіт про цільове використання 100% коштів.
                          </p>
                        </div>

                        <div className="space-y-2 md:space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Train for Care</label>
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
                            Ми змінюємо правила гри: навчання 20 психологів (90 тис. €) створює 3000 годин про-боно допомоги. Це знижує вартість курсу з 800 € (стандарт ВООЗ) до 360 € (EMDR & VR), створюючи колосальний гуманітарний ефект.
                          </p>
                          <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-[#00F5FF] uppercase tracking-widest hover:translate-x-1 transition-transform duration-200 group">
                            Докладніше <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: 4 Blocks */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                      {[
                        { 
                          name: 'Спільнокошт', 
                          value: isSlider1Moved ? simulationResults.crowdfunding : 125000, 
                          color: isSlider1Moved ? 'text-[#F59E0B]' : 'text-[#00F5FF]',
                          shouldFlip: isSlider1Moved
                        },
                        { 
                          name: 'Корпоративна філантропія', 
                          value: isSlider1Moved ? simulationResults.corporate : 350000, 
                          color: isSlider1Moved ? 'text-[#F59E0B]' : 'text-[#00F5FF]',
                          shouldFlip: isSlider1Moved
                        },
                        { 
                          name: 'Донори та фонди', 
                          value: isSlider1Moved ? simulationResults.donors : 900000, 
                          color: isSlider1Moved ? 'text-[#F59E0B]' : 'text-[#00F5FF]',
                          shouldFlip: isSlider1Moved
                        },
                        { 
                          name: 'Ефективність ресурсів', 
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
                            className="bg-[#050A15] border border-white/10 p-3 md:p-6 rounded-xl flex flex-col justify-between min-h-[100px] md:min-h-[140px] transition-all duration-300 hover:bg-white/5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:-translate-y-0.5"
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
                                {idx === 3 ? 'Розрахунковий показник' : 'Розподіл ресурсів'}
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
                              { name: 'Спільнокошт', value: simulationResults.crowdfunding },
                              { name: 'Корпорації', value: simulationResults.corporate },
                              { name: 'Донори', value: simulationResults.donors },
                              { name: 'Власні кошти', value: simulationResults.userContribution },
                            ]} 
                          />
                        </div>
                        
                        <div className="w-full md:w-1/2 space-y-4">
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Структура фінансування</h3>
                          {[
                            { name: 'Спільнокошт', color: 'bg-[#F59E0B]', value: simulationResults.crowdfunding },
                            { name: 'Корпоративна філантропія', color: 'bg-[#00F5FF]', value: simulationResults.corporate },
                            { name: 'Донори та фонди', color: 'bg-[#00FF66]', value: simulationResults.donors },
                            { name: 'Власні кошти (Funds)', color: 'bg-[#475569]', value: simulationResults.userContribution },
                          ].map((item) => (
                            <div key={item.name} className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-default">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${item.color} group-hover:scale-125 transition-transform`} />
                                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{item.name}</span>
                              </div>
                              <div className="text-xs font-mono text-white font-bold group-hover:text-[#00F5FF] transition-colors">
                                {((item.value / simulationResults.totalActualCost) * 100).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                          <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] text-slate-500 italic leading-relaxed">
                              Ця модель демонструє принцип &quot;Blended Finance&quot;, де кожне євро власного внеску залучає додаткові ресурси від партнерів, масштабуючи ваш вплив.
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
                  />
                )}
                {activeModule === 'outcomes' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white uppercase tracking-widest">Clinical Outcomes Analytics</h2>
                      <div className="text-[10px] font-mono text-slate-500">REAL-TIME CLINICAL DATA STREAM</div>
                    </div>

                    <OutcomesCharts symptomData={SYMPTOM_DATA} outcomeTrend={OUTCOME_TREND} />
                    
                    {/* Key Performance Indicators */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.03)]">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Protocol Completion</div>
                        <div className="text-2xl font-mono font-bold text-[#00F5FF]">84.2%</div>
                        <div className="text-[8px] text-[#00FF66] mt-1 uppercase font-bold tracking-tighter">+2.4% vs last month</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.03)]">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Avg Sessions</div>
                        <div className="text-2xl font-mono font-bold text-[#00F5FF]">12.4</div>
                        <div className="text-[8px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">MHPSS Standard: 16</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.03)]">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Retention Rate</div>
                        <div className="text-2xl font-mono font-bold text-[#00F5FF]">91%</div>
                        <div className="text-[8px] text-[#00FF66] mt-1 uppercase font-bold tracking-tighter">High Engagement</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,245,255,0.03)]">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Wait Time</div>
                        <div className="text-2xl font-mono font-bold text-[#00FF66]">4.2d</div>
                        <div className="text-[8px] text-[#00FF66] mt-1 uppercase font-bold tracking-tighter">Optimized Flow</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule === 'compliance' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">System Compliance & Audit</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#050A15] border border-white/10 p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Reporting & Standards</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Grand Bargain Compliance', status: 'PASS' },
                            { label: 'Localization % (Direct Funding)', status: '34.2%', color: '#00F5FF' },
                            { label: 'IATI Standard Integration', status: 'SYNCED' },
                            { label: 'mhGAP Clinical Protocols', status: 'VERIFIED' },
                            { label: 'Automated Reporting (Real-time)', status: 'ACTIVE' },
                          ].map((check) => (
                            <div key={check.label} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                              <div className="text-xs font-medium text-white">{check.label}</div>
                              <span className={`text-[10px] font-bold ${check.color ? `text-[${check.color}]` : 'text-[#00FF66]'}`} style={check.color ? { color: check.color } : {}}>{check.status}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-lg">
                          <div className="text-[10px] text-[#F59E0B] font-bold uppercase tracking-widest mb-2">Security Engine</div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Real-time transaction analysis for anomaly detection and suspicious activity identification in MHPSS funding is active.
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#050A15] border border-white/10 p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Integrity Checks</h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Clinician Identity Verification', status: 'PASS', time: '2m ago' },
                            { label: 'Smart Contract Audit (v2.1)', status: 'PASS', time: '14h ago' },
                            { label: 'Data Encryption (AES-256)', status: 'ACTIVE', time: 'Continuous' },
                            { label: 'GDPR / HIPAA Compliance', status: 'VERIFIED', time: 'Monthly' },
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
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Recent Audit Logs</h3>
                        <div className="space-y-3 font-mono text-[10px]">
                          <div className="text-slate-400">[16:02:11] <span className="text-[#F59E0B]">INFO</span>: Block 849221 verified. Tx: 0x8f...3b2a</div>
                          <div className="text-slate-400">[15:58:45] <span className="text-[#00FF66]">PASS</span>: Identity check Dr. Kovalenko (UA-MED-8492)</div>
                          <div className="text-slate-400">[15:45:30] <span className="text-[#A855F7]">SYNC</span>: Загальний пул оновлено (+$250,000)</div>
                          <div className="text-slate-400">[15:30:12] <span className="text-[#F59E0B]">WARN</span>: Latency spike detected in EU node (34ms)</div>
                          <div className="text-slate-400">[15:10:05] <span className="text-[#F59E0B]">INFO</span>: New session initiated: PTSD Initial</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule === 'nbu' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Стратегічний Брифінг: As-Is vs To-Be</h2>
                        <p className="text-sm text-slate-400 mt-2 max-w-3xl">
                          Аналітична записка для прийняття рішень. Базується на верифікованих даних WHO, ЄБРР, НБУ та консорціуму FEEL Again. 
                          Відображає вплив імплементації цифрової платіжної інфраструктури (шини інтероперабельності) MHPSS.
                        </p>
                      </div>
                      <div className="text-[10px] text-[#D4A017] border border-[#D4A017]/30 bg-[#D4A017]/10 px-3 py-2 rounded-lg flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-2 font-bold uppercase">
                          <ShieldCheck className="w-4 h-4" />
                          EXECUTIVE LEVEL
                        </div>
                        <span>Дані верифіковано | Без wishful thinking</span>
                      </div>
                    </div>

                    {/* Stakeholder Matrix */}
                    <div className="space-y-6">
                      
                      {/* 1. Держава (Україна) */}
                      <div className="bg-[#050A15] border border-white/10 rounded-xl overflow-hidden">
                        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-3">
                          <Landmark className="w-5 h-5 text-white" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest">1. Держава (Україна)</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                          {/* As-Is */}
                          <div className="p-6 bg-red-900/5">
                            <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-4">Стан As-Is (Бездіяльність)</div>
                            <div className="space-y-4">
                              <div>
                                <div className="text-3xl font-mono text-white">1% <span className="text-sm text-slate-500">покриття</span></div>
                                <div className="text-xs text-slate-400 mt-1">~100k осіб на рік при потребі 9.6M</div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                $417M щорічного фінансування без інтегрованого трекінгу. Структурна неможливість: 4000 фахівців × 25 пацієнтів/тиждень = 100,000/рік. Навчання нових кадрів не закриває розрив. Тіньовий сектор (5-8 тис. практиків) не сплачує податки.
                              </p>
                            </div>
                          </div>
                          {/* To-Be */}
                          <div className="p-6 bg-[#2A9D8F]/5">
                            <div className="text-[10px] text-[#00F5FF] font-bold uppercase tracking-widest mb-4">Стан To-Be (Імплементація)</div>
                            <div className="space-y-4">
                              <div>
                                <div className="text-3xl font-mono text-[#00F5FF]">500k+ <span className="text-sm text-slate-500">покриття</span></div>
                                <div className="text-xs text-slate-400 mt-1">Вартість інфраструктури для держави: $0.00</div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                Цифрова шина об&apos;єднує 38,000+ навчених (UNICEF/WHO) фахівців та приватну практику. Формалізація ринку, зростання податкових надходжень. Замінює 30%+ накладних витрат на 3-7% транзакційної комісії.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-3 bg-white/5 border-t border-white/10 text-[11px] text-slate-400">
                          <strong className="text-[#D4A017]">Обґрунтування:</strong> ФАКТ: Консорціум вже інвестував $5M в інфраструктуру. ПРИПУЩЕННЯ (Консервативне): Збільшення покриття до 500k базується на підключенні лише 15% від існуючого резерву навчених спеціалістів через цифрову маршрутизацію.
                        </div>
                      </div>

                      {/* 2. Банківська система */}
                      <div className="bg-[#050A15] border border-white/10 rounded-xl overflow-hidden">
                        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-3">
                          <Wallet className="w-5 h-5 text-white" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest">2. Українська банківська система</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                          {/* As-Is */}
                          <div className="p-6 bg-red-900/5">
                            <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-4">Стан As-Is (Бездіяльність)</div>
                            <div className="space-y-4">
                              <div>
                                <div className="text-3xl font-mono text-white">€48-64M <span className="text-sm text-slate-500">втрат</span></div>
                                <div className="text-xs text-slate-400 mt-1">Транзакції проходять поза банками (готівка/P2P)</div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                Декларативна участь у Хартії фінансової інклюзії ветеранів без технічних інструментів реалізації. Відсутність MHPSS-compliance для покращення скорингу.
                              </p>
                            </div>
                          </div>
                          {/* To-Be */}
                          <div className="p-6 bg-[#2A9D8F]/5">
                            <div className="text-[10px] text-[#00F5FF] font-bold uppercase tracking-widest mb-4">Стан To-Be (Імплементація)</div>
                            <div className="space-y-4">
                              <div>
                                <div className="text-3xl font-mono text-[#00F5FF]">10,000+ <span className="text-sm text-slate-500">нових ФОП</span></div>
                                <div className="text-xs text-slate-400 mt-1">Дешеві пасиви від донорських фондів</div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                Регулярний потік мікротранзакцій на escrow-рахунки банків-партнерів. Ready-made виконання зобов&apos;язань Хартії з KPI для ЄБРР.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-3 bg-white/5 border-t border-white/10 text-[11px] text-slate-400">
                          <strong className="text-[#D4A017]">Обґрунтування:</strong> ФАКТ: Банк-першопроходець забирає тіньовий потік. ПРИПУЩЕННЯ: Конвертація 50% тіньового ринку (5000-8000 практиків) у легальні ФОП рахунки завдяки вимогам платформи щодо верифікації виплат.
                        </div>
                      </div>

                      {/* 3. НБУ */}
                      <div className="bg-[#050A15] border border-white/10 rounded-xl overflow-hidden">
                        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-3">
                          <Activity className="w-5 h-5 text-white" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest">3. Національний банк України (НБУ)</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                          {/* As-Is */}
                          <div className="p-6 bg-red-900/5">
                            <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-4">Стан As-Is (Бездіяльність)</div>
                            <div className="space-y-4">
                              <div>
                                <div className="text-3xl font-mono text-white">Сліпа зона <span className="text-sm text-slate-500">в даних</span></div>
                                <div className="text-xs text-slate-400 mt-1">Деградація людського капіталу не квантифікується</div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                Відсутність даних про вплив ментального здоров&apos;я на макроекономіку. Неможливість врахувати втрати продуктивності у ВВП-моделях.
                              </p>
                            </div>
                          </div>
                          {/* To-Be */}
                          <div className="p-6 bg-[#2A9D8F]/5">
                            <div className="text-[10px] text-[#00F5FF] font-bold uppercase tracking-widest mb-4">Стан To-Be (Імплементація)</div>
                            <div className="space-y-4">
                              <div>
                                <div className="text-3xl font-mono text-[#00F5FF]">Data Custodian <span className="text-sm text-slate-500">MHEI</span></div>
                                <div className="text-xs text-slate-400 mt-1">Випереджаючий індикатор економічного здоров&apos;я</div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                НБУ отримує Mental Health Economic Index (MHEI). Анонімізована агрегація транзакцій дозволяє бачити кореляцію між MHPSS-інтервенціями, продуктивністю та кредитним ризиком.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-3 bg-white/5 border-t border-white/10 text-[11px] text-slate-400">
                          <strong className="text-[#D4A017]">Обґрунтування:</strong> ФАКТ: Всі транзакції платформи проходять через банки. ПРИПУЩЕННЯ: НБУ виступає виключно як custodian даних, не надавач медпослуг, використовуючи транзакційний слід для макроекономічного прогнозування.
                        </div>
                      </div>

                      {/* 4. ЄБРР / Мірбанк */}
                      <div className="bg-[#050A15] border border-white/10 rounded-xl overflow-hidden">
                        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-white" />
                          <h3 className="text-sm font-bold text-white uppercase tracking-widest">4. Світовий банк (Мірбанк) та ЄБРР</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                          {/* As-Is */}
                          <div className="p-6 bg-red-900/5">
                            <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-4">Стан As-Is (Бездіяльність)</div>
                            <div className="space-y-4">
                              <div>
                                <div className="text-3xl font-mono text-white">€250M <span className="text-sm text-slate-500">гарантій</span></div>
                                <div className="text-xs text-slate-400 mt-1">Не мають верифікованого MHPSS-компоненту</div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                Гуманітарні проєкти фінансують процеси (inputs), а не результати (outcomes). Відсутність інструменту для аудиту ефективності витрат на відновлення.
                              </p>
                            </div>
                          </div>
                          {/* To-Be */}
                          <div className="p-6 bg-[#2A9D8F]/5">
                            <div className="text-[10px] text-[#00F5FF] font-bold uppercase tracking-widest mb-4">Стан To-Be (Імплементація)</div>
                            <div className="space-y-4">
                              <div>
                                <div className="text-3xl font-mono text-[#00F5FF]">1:3-10 <span className="text-sm text-slate-500">ROI (WHO)</span></div>
                                <div className="text-xs text-slate-400 mt-1">Запуск Social Impact Bonds</div>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                MHPSS стає обов&apos;язковим компонентом інфраструктурних кредитів. Платформа забезпечує 100% відстежуваність транзакцій (blockchain-реєстр) для outcome-based платежів.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 py-3 bg-white/5 border-t border-white/10 text-[11px] text-slate-400">
                          <strong className="text-[#D4A017]">Обґрунтування:</strong> ФАКТ: Кожен $1 попереджує $3–10 втрат (WHO). Методологія LSE: захист $8–28B/рік. Blockchain-архітектура (Solana/Quoroom) унеможливлює маніпуляції з даними про надані послуги.
                        </div>
                      </div>

                    </div>

                    {/* NBU Scoring System & Composite Indices */}
                    <div className="bg-[#050A15] border border-white/10 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Композитні Індекси: MWI та MHEI</h3>
                        <div className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">NBU SCORING METRICS</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Current Performance */}
                        <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <div className="text-[10px] text-red-400/70 uppercase tracking-widest mb-1">Current Performance</div>
                              <div className="text-xs text-slate-400">Baseline (Crisis State)</div>
                            </div>
                            <div className="text-4xl font-mono font-bold text-red-400">12<span className="text-sm text-slate-500">/100</span></div>
                          </div>
                          <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-4">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '12%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: 'easeOut' }}
                              className="h-full bg-red-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500">System Capacity</span>
                              <span className="text-white">1% (100k/yr)</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500">Economic Impact</span>
                              <span className="text-red-400">Severe Drag</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500">Data Transparency</span>
                              <span className="text-red-400">Low / Fragmented</span>
                            </div>
                          </div>
                        </div>

                        {/* Projected Performance */}
                        <div className="bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 p-5 rounded-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#00F5FF]" />
                          <div className="flex justify-between items-end mb-4">
                            <div>
                              <div className="text-[10px] text-[#00F5FF]/70 uppercase tracking-widest mb-1">Projected Performance</div>
                              <div className="text-xs text-slate-400">FEEL Again Implementation</div>
                            </div>
                            <div className="text-4xl font-mono font-bold text-[#00F5FF]">85<span className="text-sm text-slate-500">/100</span></div>
                          </div>
                          <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mb-4">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '85%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                              className="h-full bg-[#00F5FF]"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500">System Capacity</span>
                              <span className="text-white">~15% (500k/yr)</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500">Economic Impact</span>
                              <span className="text-[#00F5FF]">Growth Catalyst</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono">
                              <span className="text-slate-500">Data Transparency</span>
                              <span className="text-[#00F5FF]">High / Unified</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg flex gap-4 items-start">
                        <Activity className="w-5 h-5 text-[#D4A017] shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong className="text-white">Mental Well-being Index (MWI)</strong> та <strong className="text-white">Mental Health Economic Index (MHEI)</strong> — це композитні метрики, що формуються на перетині транзакційної активності (банківські дані) та клінічних результатів (PHQ-9/GAD-7).
                          </p>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            <strong className="text-[#D4A017]">Походження та Обґрунтування:</strong> Імплементація цифрової шини дозволяє перейти від &quot;оплати за процес&quot; до &quot;оплати за результат&quot; (outcome-based). Прогнозоване зростання індексу до 85/100 базується на відсіканні неефективних практик та інтеграції Stepped Care протоколів з VR-мультиплікаторами, що математично доведено знижує економічний тягар нелікованої травми.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Divergence Chart */}
                    <div className="bg-[#050A15] border border-white/10 p-6 rounded-xl">
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Дивергенція Композитного Індексу (Проєкція 2024-2028)</h3>
                      <div className="relative h-[250px] w-full border-b border-l border-white/20 mt-4">
                        {/* Y-Axis Labels */}
                        <div className="absolute -left-8 bottom-0 text-[10px] text-slate-500 font-mono">Min</div>
                        <div className="absolute -left-8 top-0 text-[10px] text-slate-500 font-mono">Max</div>
                        
                        {/* X-Axis Labels */}
                        <div className="absolute -bottom-6 left-[10%] text-[10px] text-slate-500 font-mono">2024</div>
                        <div className="absolute -bottom-6 left-[30%] text-[10px] text-slate-500 font-mono">2025</div>
                        <div className="absolute -bottom-6 left-[50%] text-[10px] text-white font-bold font-mono">2026 (Запуск)</div>
                        <div className="absolute -bottom-6 left-[70%] text-[10px] text-slate-500 font-mono">2027</div>
                        <div className="absolute -bottom-6 left-[90%] text-[10px] text-slate-500 font-mono">2028</div>

                        {/* Grid Lines */}
                        <div className="absolute top-[25%] w-full border-t border-white/5 border-dashed" />
                        <div className="absolute top-[50%] w-full border-t border-white/5 border-dashed" />
                        <div className="absolute top-[75%] w-full border-t border-white/5 border-dashed" />
                        <div className="absolute left-[50%] h-full border-l border-white/10 border-dashed" />

                        {/* Baseline (Historical) */}
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <path d="M 0 40 Q 25 45 50 50" fill="none" stroke="#94a3b8" strokeWidth="2" />
                          
                          {/* Inaction Path (Red) */}
                          <path d="M 50 50 Q 75 70 100 85" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                          
                          {/* Implementation Path (Green/Cyan) */}
                          <path d="M 50 50 Q 75 30 100 15" fill="none" stroke="#00F5FF" strokeWidth="3" />
                        </svg>

                        {/* Data Points */}
                        <div className="absolute left-[50%] top-[50%] w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]" />
                        <div className="absolute left-[100%] top-[85%] w-2 h-2 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute left-[100%] top-[15%] w-3 h-3 bg-[#00F5FF] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#00F5FF]" />

                        {/* Labels */}
                        <div className="absolute right-4 top-[20%] text-[10px] font-bold text-[#00F5FF] bg-[#050A15] px-2 py-1 rounded border border-[#00F5FF]/20">
                          FEEL Again (+300% Спроможність)
                        </div>
                        <div className="absolute right-4 bottom-[10%] text-[10px] font-bold text-red-400 bg-[#050A15] px-2 py-1 rounded border border-red-500/20">
                          Бездіяльність (Колапс)
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
              <button className="hover:text-white transition-colors">Cookies Settings</button>
              <button className="hover:text-white transition-colors">Cookie Statement</button>
              <button className="hover:text-white transition-colors">Privacy Statement</button>
              <button className="hover:text-white transition-colors">Disclaimer</button>
            </div>
          </footer>
        </div>
      </main>
    );
  }
