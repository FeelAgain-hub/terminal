'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ImpactCalculator from '@/components/ImpactCalculator';

export default function TrainingsPage() {
  const [form, setForm] = useState({
    notify: false,
    hoursPerWeek: '',
    participation: 'self',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; hoursPerWeek?: string }>({});

  // Calculator State
  const [calcBeneficiaries, setCalcBeneficiaries] = useState<number>(1);
  const [calcMixedRate, setCalcMixedRate] = useState<number>(100);
  const [calcPsychologists, setCalcPsychologists] = useState<number>(0);
  const [isSlider1Moved, setIsSlider1Moved] = useState(false);
  const [isSlider2Moved, setIsSlider2Moved] = useState(false);
  const [isAnimatingSlider2, setIsAnimatingSlider2] = useState(false);

  // Calculator Constants
  const TRAINING_GROUP_SIZE = 20;
  const TRAINING_GROUP_COST = 48025;
  const PRO_BONO_HOURS_PER_STUDENT = 120;
  const SESSIONS_PER_BENEFICIARY_INTERNAL = 12;
  const SESSIONS_PER_BENEFICIARY_MARKET = 16;
  const MARKET_HOUR_RATE = 50;
  const MARKET_COURSE_VALUE = SESSIONS_PER_BENEFICIARY_MARKET * MARKET_HOUR_RATE;

  // Calculator Effects
  React.useEffect(() => {
    if (calcPsychologists > 0) {
      setIsAnimatingSlider2(true);
      const timer = setTimeout(() => setIsAnimatingSlider2(false), 800);
      return () => clearTimeout(timer);
    }
  }, [calcPsychologists]);

  // Calculator Simulation Results
  const simulationResults = React.useMemo(() => {
    const addedBeneficiaries = (calcPsychologists / TRAINING_GROUP_SIZE) * (TRAINING_GROUP_SIZE * PRO_BONO_HOURS_PER_STUDENT / SESSIONS_PER_BENEFICIARY_INTERNAL);
    const totalBeneficiaries = calcBeneficiaries + addedBeneficiaries;
    
    const baseCost = calcBeneficiaries * MARKET_COURSE_VALUE;
    const trainingCost = (calcPsychologists / TRAINING_GROUP_SIZE) * TRAINING_GROUP_COST;
    const totalActualCost = baseCost + trainingCost;
    
    const userContribution = totalActualCost * (calcMixedRate / 100);
    const otherFunding = totalActualCost - userContribution;
    
    const crowdfundingRatio = 0.10;
    const corporateRatio = 0.25;
    const donorsRatio = 0.65;
    
    const crowdfunding = otherFunding * crowdfundingRatio;
    const corporate = otherFunding * corporateRatio;
    const donors = otherFunding * donorsRatio;
    
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

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const validateAndSetErrors = () => {
    const errs: { email?: string; hoursPerWeek?: string } = {};
    if (form.notify && !form.email) {
      errs.email = 'Вкажіть e-mail, щоб отримати повідомлення';
    } else if (form.email && !validateEmail(form.email)) {
      errs.email = 'Невірний формат e-mail';
    }
    if (form.hoursPerWeek && form.hoursPerWeek.trim() !== '' && isNaN(Number(form.hoursPerWeek))) {
      errs.hoursPerWeek = 'Вкажіть число (години)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const isFormValid = () => {
    if (form.notify && !form.email) return false;
    if (form.email && !validateEmail(form.email)) return false;
    if (form.hoursPerWeek && form.hoursPerWeek.trim() !== '' && isNaN(Number(form.hoursPerWeek))) return false;
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAndSetErrors()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Static site — log interest locally and show confirmation
    await new Promise(resolve => setTimeout(resolve, 600));
    try {
      const existing = JSON.parse(localStorage.getItem('feel_registrations') || '[]');
      existing.push({ ...form, timestamp: new Date().toISOString() });
      localStorage.setItem('feel_registrations', JSON.stringify(existing));
    } catch (_) { /* ignore storage errors */ }
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-[#02040A] text-slate-200 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Slide 1: Title */}
        <section className="bg-[#050A15] border border-white/10 p-8 rounded-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Програма потрійної сертифікації «FEEL Again»</h1>
          <p className="mt-3 text-slate-400">Інтеграція фундаментальних клінічних інструментів (EMDR) та інноваційних VR-методологій у терапії ПТСР.</p>
          <div className="mt-4 text-sm text-slate-500">Перейти назад: <Link href="/" className="text-[#00F5FF] hover:underline">Головна</Link></div>

          {/* Real Impact Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">3.9M</div>
              <div className="text-xs text-slate-400">потребують лікування</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">62.4M</div>
              <div className="text-xs text-slate-400">клінічних годин</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">€2.5-4.1B</div>
              <div className="text-xs text-slate-400">ринковий потенціал</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">15K</div>
              <div className="text-xs text-slate-400">фахівців у тіні</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">87.4</div>
              <div className="text-xs text-slate-400">індекс підтримки MHPSS</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">2,849</div>
              <div className="text-xs text-slate-400">активних сесій</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">47</div>
              <div className="text-xs text-slate-400">організацій-учасників</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">95.0%</div>
              <div className="text-xs text-slate-400">прозорість транзакцій</div>
            </div>
          </div>
        </section>

        {/* Slide 2: Architecture */}
        <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-white">Архітектура методології: Фундамент та Надбудова</h2>
          <div className="mt-3 text-slate-300 space-y-3">
            <p><strong>Фундамент — MHPSS Heavy Industry / EMDR (Geha):</strong> EMDR від ізраїльського центру Geha — непорушна клінічна основа та фундаментальний протокол лікування травми. Це «важка промисловість» охорони психічного здоров'я: клінічна строгость, протоколи, контроль якості.</p>
            <p><strong>Надбудова — VR (Bravemind, Virtual Sandtray):</strong> Технології VR — це передова методологія доставки, яка ідеально лягає на цю клінічну базу: дозволяє долати уникнення пацієнтів і подавати експозицію там, де уява блокується.</p>
            <p><strong>Поєднана супервізія:</strong> Інтеграція клініки та технології закріплюється через супервізію, яка контролює якість, етичність і коректне поєднання методів.</p>
          </div>

          {/* Problem Analysis */}
          <div className="mt-6 bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Критична ситуація в секторі МЗПСП:</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 96,000 онлайн-сертифікатів mhGAP → лише 42 практикуючих (&lt;0.1% конверсія)</li>
              <li>• 624,000 послуг надано через HEAL → 0% потрапило в ЕСОЗ (систему обліку)</li>
              <li>• 89% бюджету на стаціонари, хоча 64-71% звертаються амбулаторно</li>
              <li>• 15,000 фахівців у тіньовому секторі — невидимі для системи</li>
              <li>• €979/міс штраф за формалізацію = 65% від доходу</li>
            </ul>
          </div>
        </section>

        {/* Slide 3: Module 1 */}
        <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white">Модуль 1. Фундамент: MHPSS Heavy Industry (Досвід Geha)</h3>
          <ul className="mt-3 list-disc list-inside text-slate-300 space-y-2">
            <li>Терапевтичні стратегії втручання при психічній травмі (ASR, ASD, ПТСР).</li>
            <li>Процедури негайної стабілізації (Immediate Stabilization Procedure).</li>
            <li>Опанування стратегій та технік EMDR згідно з протоколами Geha.</li>
            <li className="mt-2 font-bold">Орієнтовне навантаження: 42 години (10 год. стратегії + 8 год. стабілізація + 24 год. техніки EMDR).</li>
          </ul>
        </section>

        {/* Slide 4: Module 2 */}
        <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white">Модуль 2. Інноваційна надбудова (VR та Цифрова пісочниця)</h3>
          <div className="mt-3 text-slate-300 space-y-2">
            <p><strong>Bravemind VRET:</strong> Градієнтна віртуальна експозиція для подолання бар'єрів уникнення у дорослих. Застосовується як інструмент доставки на базі EMDR.</p>
            <p><strong>Virtual Sandtray:</strong> Цифрова ігрова терапія для невербального опрацювання травми у дітей.</p>
            <p className="mt-2 font-bold">Орієнтовне навантаження: 20 годин (по 10 годин на кожну методологію).</p>
          </div>
        </section>

        {/* Slide 5: Supervision */}
        <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white">Блок: Поєднана супервізія</h3>
          <div className="mt-3 text-slate-300 space-y-2">
            <p>Інтеграція отриманих знань (EMDR + VR) у реальну клінічну практику через тривалу групову супервізію. Фокус: екологічне закріплення, розбір складних кейсів, контроль дотримання протоколів.</p>
            <p className="mt-2 font-bold">Орієнтовне навантаження: 24 години регулярних сесій (дві групи по 12 годин).</p>
          </div>
        </section>

        {/* Slide 6: Why FEEL Again is Essential */}
        <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white">Чому FEEL Again необхідний: Реальні цифри кризи</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                <div className="text-red-400 font-bold text-lg">3.9 МІЛЬЙОНИ</div>
                <div className="text-slate-300 text-sm">людей потребують лікування ПТСР</div>
                <div className="text-slate-400 text-xs mt-1">62.4M клінічних годин (×16 сесій)</div>
              </div>
              <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
                <div className="text-orange-400 font-bold text-lg">1.3 ПСИХОЛОГА</div>
                <div className="text-slate-300 text-sm">на 100 000 населення</div>
                <div className="text-slate-400 text-xs mt-1">ВООЗ рекомендує: 6.5</div>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
                <div className="text-yellow-400 font-bold text-lg">&lt;0.1%</div>
                <div className="text-slate-300 text-sm">конверсія тренінгів</div>
                <div className="text-slate-400 text-xs mt-1">96K сертифікатів → 42 практикуючих</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                <div className="text-blue-400 font-bold text-lg">₴6.47 МІЛЬЯРДІВ</div>
                <div className="text-slate-300 text-sm">бюджет на психічне здоров'я</div>
                <div className="text-slate-400 text-xs mt-1">89% йде на стаціонари</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                <div className="text-purple-400 font-bold text-lg">€979/МІС</div>
                <div className="text-slate-300 text-sm">штраф за формалізацію</div>
                <div className="text-slate-400 text-xs mt-1">65% від доходу фахівця</div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                <div className="text-green-400 font-bold text-lg">€2.5-4.1 МІЛЬЯРДІВ</div>
                <div className="text-slate-300 text-sm">ринок психічного здоров'я</div>
                <div className="text-slate-400 text-xs mt-1">потенціал України</div>
              </div>
            </div>
          </div>
          <div className="mt-6 bg-slate-800/50 p-4 rounded-lg">
            <div className="text-slate-200 font-semibold mb-2">Що це означає для FEEL Again:</div>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• <strong>Масштаб:</strong> 62.4M годин лікування потрібні зараз — наша інфраструктура забезпечить доставку</li>
              <li>• <strong>Ефективність:</strong> 96K сертифікатів дають лише 42 практикуючих — ми інтегруємо навчання з практикою</li>
              <li>• <strong>Економіка:</strong> €979/міс штраф блокує формалізацію — наша платформа знижує friction до мінімуму</li>
              <li>• <strong>Доступність:</strong> 89% бюджету на стаціонари замість амбулаторії — ми переносимо допомогу в амбулаторний сектор</li>
            </ul>
          </div>
        </section>

        {/* Slide 7: CTA / Form */}
        <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white">Заклик до дії — Анкета учасника</h3>
          {/* Current Platform Metrics */}
          <div className="mb-6 bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3">Поточні результати платформи FEEL Again:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-white/5 p-2 rounded">
                <div className="text-lg font-bold text-green-400">87.4</div>
                <div className="text-xs text-slate-400">MHPSS Support Index</div>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <div className="text-lg font-bold text-green-400">47</div>
                <div className="text-xs text-slate-400">організацій-учасників</div>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <div className="text-lg font-bold text-green-400">2,849</div>
                <div className="text-xs text-slate-400">активних сесій</div>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <div className="text-lg font-bold text-green-400">229</div>
                <div className="text-xs text-slate-400">клінічних верифікацій</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm mt-3">
              <strong>Прогнозований вплив:</strong> Програма може збільшити конверсію сертифікатів з &lt;0.1% до 15-25% через інтегровану супервізію та цифрову інфраструктуру.
            </p>
          </div>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <label className="flex items-center gap-3">
                <input name="notify" type="checkbox" checked={form.notify} onChange={handleChange} />
                <span className="text-slate-300">Повідомте, коли буде відкрито запис на тренінг</span>
              </label>

              <label className="flex flex-col">
                <span className="text-slate-400 text-sm mb-1">Кількість годин на тиждень, які я можу віддати:</span>
                <input name="hoursPerWeek" type="text" value={form.hoursPerWeek} onChange={handleChange} className="bg-transparent border border-white/10 rounded-md p-2 text-slate-200" placeholder="Наприклад: 4" />
                {errors.hoursPerWeek && <div className="text-xs text-rose-400 mt-1">{errors.hoursPerWeek}</div>}
              </label>

              <label className="flex flex-col">
                <span className="text-slate-400 text-sm mb-1">Бажана форма взаємовідносин</span>
                <select name="participation" value={form.participation} onChange={handleChange} className="bg-transparent border border-white/10 rounded-md p-2 text-slate-200">
                  <option value="self">Оплатити тренінг самостійно</option>
                  <option value="trainforcare">Train for Care (pro bono в обмін)</option>
                </select>
              </label>

              <label className="flex flex-col">
                <span className="text-slate-400 text-sm mb-1">E-mail для зв'язку</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="bg-transparent border border-white/10 rounded-md p-2 text-slate-200" placeholder="ваш@email.com" />
                {errors.email && <div className="text-xs text-rose-400 mt-1">{errors.email}</div>}
              </label>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={!isFormValid() || isSubmitting} className="bg-[#F59E0B] text-[#050A15] font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Надсилається...' : 'Надіслати'}
                </button>
                <a href="https://feelagain.me" target="_blank" rel="noreferrer" className="text-[#00F5FF] hover:underline">Дізнатися більше на feelagain.me</a>
              </div>
              {submitError && (
                <div className="text-rose-400 text-sm mt-2">{submitError}</div>
              )}
            </form>
          ) : (
            <div className="bg-white/5 border border-white/10 p-4 rounded-md">
              <div className="font-bold text-white">Дякуємо!</div>
              <div className="text-slate-400 mt-2">Ми отримали вашу заявку і надішлемо деталі на вказаний e-mail.</div>
            </div>
          )}
        </section>

        {/* ROI Calculator Section */}
        <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">Калькулятор ROI — Розрахунок ефективності FEEL Again</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calculator Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Кількість бенефіціарів (пацієнтів)
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={calcBeneficiaries}
                  onChange={(e) => {
                    setCalcBeneficiaries(Number(e.target.value));
                    setIsSlider1Moved(true);
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1</span>
                  <span className="text-white font-bold">{calcBeneficiaries.toLocaleString()}</span>
                  <span>1000</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Змішане фінансування (% від користувача)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={calcMixedRate}
                  onChange={(e) => setCalcMixedRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span className="text-white font-bold">{calcMixedRate}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Кількість тренованих психологів
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={calcPsychologists}
                  onChange={(e) => setCalcPsychologists(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0</span>
                  <span className={`font-bold ${isAnimatingSlider2 ? 'text-green-400' : 'text-white'}`}>
                    {calcPsychologists}
                  </span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Calculator Results */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="text-slate-300 text-sm">Загальна кількість бенефіціарів</div>
                <div className="text-2xl font-bold text-white">
                  {simulationResults.totalBeneficiaries.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">
                  +{simulationResults.addedBeneficiaries.toFixed(0)} від тренінгів
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="text-slate-300 text-sm">Внесок користувача</div>
                <div className="text-2xl font-bold text-white">
                  €{simulationResults.userContribution.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="text-slate-300 text-sm">Ефективність (ROI)</div>
                <div className="text-2xl font-bold text-green-400">
                  {simulationResults.totalEfficiency.toFixed(1)}x
                </div>
                <div className="text-xs text-slate-400">
                  Ринкова вартість: €{simulationResults.totalMarketValue.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <div className="text-slate-300 text-sm">Вартість на бенефіціара</div>
                <div className="text-2xl font-bold text-white">
                  €{simulationResults.effectiveCostPerBeneficiary.toFixed(0)}
                </div>
                <div className="text-xs text-slate-400">
                  Ринкова: €{MARKET_COURSE_VALUE}
                </div>
              </div>
            </div>
          </div>

          {/* Funding Breakdown */}
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-3">Розподіл фінансування</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-lg text-center">
                <div className="text-blue-400 text-sm">Краудфандинг</div>
                <div className="text-white font-bold">€{simulationResults.crowdfunding.toLocaleString()}</div>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 p-3 rounded-lg text-center">
                <div className="text-purple-400 text-sm">Корпоративні</div>
                <div className="text-white font-bold">€{simulationResults.corporate.toLocaleString()}</div>
              </div>
              <div className="bg-green-500/20 border border-green-500/30 p-3 rounded-lg text-center">
                <div className="text-green-400 text-sm">Донори</div>
                <div className="text-white font-bold">€{simulationResults.donors.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Calculator Section */}
        <ImpactCalculator />

        {/* Resources & Media (placeholders for PDFs, images, videos) */}
        <section className="bg-[#050A15] border border-white/10 p-6 rounded-2xl">

          <h3 className="text-lg font-semibold text-white">Ресурси та медіа</h3>
          <p className="mt-3 text-slate-300">Тут будуть інтегровані PDF-презентації, ілюстрації та відео з демо-сцена ми виберемо сцени війни та релевантні кадри для клінічних демонстрацій. Якщо у вас є публічні посилання — вставлю прямо у вбудований переглядач.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/6 rounded-md p-3 min-h-[160px] flex flex-col">
              <div className="font-bold text-white">Аналіз сектору МЗПСП в Україні</div>
              <div className="text-slate-400 text-sm mt-2">Детальний дашборд з даними про потреби, бюджет та ефективність програм. Показує критичні розриви в системі.</div>
              <div className="mt-auto flex gap-2">
                <a href="https://dashboard-1q7.pages.dev/" target="_blank" rel="noreferrer" className="text-[#00F5FF] hover:underline text-sm">Відкрити дашборд →</a>
              </div>
            </div>

            <div className="bg-white/5 border border-white/6 rounded-md p-3 min-h-[160px] flex flex-col">
              <div className="font-bold text-white">Платформа FEEL Again (демо)</div>
              <div className="text-slate-400 text-sm mt-2">Жива демонстрація екосистеми з метриками підтримки, організаціями та верифікаціями. Показує поточні результати.</div>
              <div className="mt-auto flex gap-2">
                <a href="https://humanitarian-platform--alexezav.replit.app/" target="_blank" rel="noreferrer" className="text-[#00F5FF] hover:underline text-sm">Відкрити платформу →</a>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="font-semibold text-white">Цитати</div>
            <div className="mt-2 text-slate-300">Placeholder для цитат — додайте, будь ласка, точні цитати Скіпа або дозвольте доступ до документу, і я вставлю їх із зазначенням джерела.</div>
          </div>
        </section>
      </div>
    </main>
  );
}
