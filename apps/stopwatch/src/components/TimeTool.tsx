import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stopwatch } from './Stopwatch';
import { Timer } from './Timer';

type Mode = 'stopwatch' | 'timer';

export function TimeTool() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('stopwatch');

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
      <div className="flex w-full max-w-xs gap-1 rounded-xl bg-neutral-800 p-1">
        {(['stopwatch', 'timer'] as Mode[]).map((mo) => (
          <button
            key={mo}
            type="button"
            onClick={() => setMode(mo)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === mo ? 'bg-orange-500 text-neutral-900' : 'text-neutral-300 hover:bg-white/5'
            }`}
          >
            {t(`mode.${mo}`)}
          </button>
        ))}
      </div>

      {mode === 'stopwatch' ? <Stopwatch /> : <Timer />}
    </div>
  );
}
