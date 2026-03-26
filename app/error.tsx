'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050A15] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-white mb-4">Щось пішло не так</h2>
        <p className="text-slate-400 mb-8">
          Сталася помилка при завантаженні цієї сторінки. Будь ласка, спробуйте ще раз.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#00E5FF]/10 border border-[#00E5FF] text-[#00E5FF] rounded-full font-bold uppercase tracking-widest hover:bg-[#00E5FF] hover:text-[#050A15] transition-all"
        >
          Спробувати знову
        </button>
      </div>
    </div>
  );
}
