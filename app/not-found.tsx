'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050A15] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-slate-400 text-xl mb-8">Сторінку не знайдено</p>
        <Link 
          href="/"
          className="px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF] text-[#00E5FF] rounded-full font-bold uppercase tracking-widest hover:bg-[#00E5FF] hover:text-[#050A15] transition-all"
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
}
