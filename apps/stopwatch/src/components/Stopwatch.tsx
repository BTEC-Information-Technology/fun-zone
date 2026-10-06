import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatStopwatch, lapDeltas } from '../lib/time';

export function Stopwatch() {
  const { t } = useTranslation();
  const [running, setRunning] = useState(false);
  const [display, setDisplay] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const accRef = useRef(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const tick = () => {
      setDisplay(accRef.current + (performance.now() - startRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      accRef.current += performance.now() - startRef.current;
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    accRef.current = 0;
    setDisplay(0);
    setLaps([]);
  };

  const deltas = lapDeltas(laps);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="font-mono text-6xl font-light tabular-nums text-orange-200 sm:text-7xl">
        {formatStopwatch(display)}
      </div>

      <div className="flex w-full max-w-xs gap-3">
        {!running && display === 0 ? (
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="flex-1 rounded-xl bg-orange-500 py-3 text-lg font-semibold text-neutral-900 transition-colors hover:bg-orange-400"
          >
            {t('btn.start')}
          </button>
        ) : running ? (
          <>
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl bg-neutral-700 py-3 font-medium transition-colors hover:bg-neutral-600"
            >
              {t('btn.reset')}
            </button>
            <button
              type="button"
              onClick={() => setLaps((l) => [...l, display])}
              className="flex-1 rounded-xl bg-neutral-700 py-3 font-medium transition-colors hover:bg-neutral-600"
            >
              {t('btn.lap')}
            </button>
            <button
              type="button"
              onClick={() => setRunning(false)}
              className="flex-1 rounded-xl bg-amber-500 py-3 font-semibold text-neutral-900 transition-colors hover:bg-amber-400"
            >
              {t('btn.pause')}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl bg-neutral-700 py-3 font-medium transition-colors hover:bg-neutral-600"
            >
              {t('btn.reset')}
            </button>
            <button
              type="button"
              onClick={() => setRunning(true)}
              className="flex-1 rounded-xl bg-orange-500 py-3 font-semibold text-neutral-900 transition-colors hover:bg-orange-400"
            >
              {t('btn.resume')}
            </button>
          </>
        )}
      </div>

      {laps.length > 0 && (
        <div className="w-full max-w-xs overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-3 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-wide text-neutral-400">
            <span>{t('laps.col')}</span>
            <span className="text-right">{t('laps.split')}</span>
            <span className="text-right">{t('laps.total')}</span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {laps
              .map((total, i) => ({ n: i + 1, split: deltas[i], total }))
              .reverse()
              .map((row) => (
                <div
                  key={row.n}
                  className="grid grid-cols-3 px-3 py-1.5 font-mono text-sm tabular-nums odd:bg-white/[0.02]"
                >
                  <span className="text-neutral-300">{row.n}</span>
                  <span className="text-right text-orange-200">{formatStopwatch(row.split)}</span>
                  <span className="text-right text-neutral-400">{formatStopwatch(row.total)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
