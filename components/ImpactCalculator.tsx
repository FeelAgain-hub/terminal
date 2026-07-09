'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Users, Wallet, ArrowRight } from 'lucide-react';
import { FormattedValue } from '@/components/FormattedValue';
import { Language, translations } from '@/lib/translations';

interface CalculatorProps {
  lang?: Language;
}

export default function ImpactCalculator({ lang = 'ua' }: CalculatorProps) {
  const t = translations[lang];

  // Calculator State
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
  const TRAINING_GROUP_COST = 48025; // was 90000
  const PRO_BONO_HOURS_PER_STUDENT = 120; // was 150
  const SESSIONS_PER_BENEFICIARY_INTERNAL = 12; // EMDR & VR
  const SESSIONS_PER_BENEFICIARY_MARKET = 16; // WHO Standard
  const MARKET_HOUR_RATE = 50;
  const MARKET_COURSE_VALUE = SESSIONS_PER_BENEFICIARY_MARKET * MARKET_HOUR_RATE; // 800

  const simulationResults = useMemo(() => {
    // 1. Calculate added beneficiaries from training
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
  }, [calcBeneficiaries, calcMixedRate, calcPsychologists]);

  return (
    <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{t.impactCalculator}</h3>
        <div className="text-xs text-slate-500">FEEL Again ROI Calculator</div>
      </div>

      {/* Results Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          animate={isAnimatingSlider2 ? { scale: [1, 1.02, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,245,255,0.4)', 'rgba(255,255,255,0.1)'] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center group transition-all hover:border-[#00F5FF]/30"
        >
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">{t.coverage}</div>
          <div className="flex items-center gap-1">
            <div className="text-2xl font-mono font-bold text-[#00F5FF]">
              {Math.round(simulationResults.totalBeneficiaries)}
            </div>
            <Users className="w-5 h-5 text-slate-600" />
          </div>
        </motion.div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center group transition-all hover:border-[#F59E0B]/30">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">{t.contributionAmount}</div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-mono font-bold text-white">€</span>
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
              className="bg-transparent text-xl font-mono font-bold text-white w-20 text-center focus:outline-none focus:text-[#F59E0B]"
            />
            <Wallet className="w-5 h-5 text-slate-600" />
          </div>
        </div>

        <motion.div
          animate={isAnimatingSlider2 ? { scale: [1, 1.05, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,255,102,0.5)', 'rgba(255,255,255,0.1)'] } : {}}
          transition={{ duration: 0.4 }}
          className={`bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-500 ${isSlider2Moved ? 'opacity-100 border-[#00FF66]/30' : 'opacity-30 grayscale'}`}
        >
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">{t.trainingPsychologists}</div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-mono font-bold text-white">
              {calcPsychologists}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase">{t.psych}</span>
          </div>
        </motion.div>

        <motion.div
          animate={isAnimatingSlider2 ? { scale: [1, 1.02, 1], borderColor: ['rgba(255,255,255,0.1)', 'rgba(0,255,102,0.4)', 'rgba(255,255,255,0.1)'] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center group transition-all hover:border-[#00FF66]/30"
        >
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">{t.courseCost}</div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-mono font-bold text-[#00FF66]">
              €{Math.round(simulationResults.effectiveCostPerBeneficiary)}
            </span>
            <div className="text-xs text-slate-500 font-bold uppercase">/ {t.perPerson}</div>
          </div>
        </motion.div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t.mixedFinanceLabel}</label>
            <span className="text-sm font-mono text-[#F59E0B] font-bold">{calcMixedRate}%</span>
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
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
          />
          <p className="text-sm text-slate-500 leading-relaxed">
            {t.mixedDesc}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t.trainingPsychologists}</label>
            <span className="text-sm font-mono text-[#00FF66] font-bold">{calcPsychologists}</span>
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
              setCalcMixedRate(100);
            }}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF66]"
          />
          <p className="text-sm text-slate-500 leading-relaxed">
            {t.trainingDesc}
          </p>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#00F5FF] uppercase tracking-widest hover:underline">
            {lang === 'en' ? 'View Dashboard' : 'Переглянути дашборд'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Funding Distribution */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            name: t.crowdfunding,
            value: (isSlider1Moved || isSlider2Moved) ? simulationResults.crowdfunding : 125000,
            color: (isSlider1Moved || isSlider2Moved) ? 'text-[#F59E0B]' : 'text-[#00F5FF]'
          },
          {
            name: t.corporate,
            value: (isSlider1Moved || isSlider2Moved) ? simulationResults.corporate : 350000,
            color: (isSlider1Moved || isSlider2Moved) ? 'text-[#F59E0B]' : 'text-[#00F5FF]'
          },
          {
            name: t.donors,
            value: (isSlider1Moved || isSlider2Moved) ? simulationResults.donors : 900000,
            color: (isSlider1Moved || isSlider2Moved) ? 'text-[#F59E0B]' : 'text-[#00F5FF]'
          },
          {
            name: t.resourceEfficiency,
            value: simulationResults.totalEfficiency.toFixed(2) + 'x',
            color: (isSlider1Moved || isSlider2Moved) ? 'text-[#F59E0B]' : 'text-[#00F5FF]'
          },
        ].map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center"
          >
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">{item.name}</div>
            <div className={`text-lg font-mono font-bold ${item.color}`}>
              {typeof item.value === 'number' ? <FormattedValue value={item.value} type="currency" /> : item.value}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}