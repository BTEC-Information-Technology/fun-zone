import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { beep, ensureAudio } from '../lib/alarm';
import { formatTimer, toMs } from '../lib/time';

const PRESETS = [1, 3, 5, 10]; // minutes

export function Timer() {
  const { t } = useTranslation();
  const [h, setH] = useState(0);
  const [m, setM] = useState(5);
  const [s, setS] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const endRef = useRef(0);
  const rafRef = useRef(0);

  const total = toMs(h, m, s);
  const shown = started ? remaining : total;

  useEffect(() => {
    if (!running) return;
    endRef.current = performance.now() + remaining;
    const tick = () => {
      const r = endRef.current - performance.now();
      if (r <= 0) {
        setRemaining(0);
        setRunning(false);
        setDone(true);
        beep();
        return;
      }
      setRemaining(r);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const start = () => {
    if (total <= 0) return;
    ensureAudio();
    setRemaining(total);
    setStarted(true);
    setDone(false);
    setRunning(true);
  };
  const reset = () => {
    setRunning(false);
    setStarted(false);
    setDone(false);
    setRemaining(0);
  };
  const togglePause = () => setRunning((r) => !r);

  const setPreset = (min: number) => {
    setH(0);
    setM(min);
    setS(0);
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        className={`font-mono text-6xl font-light tabular-nums sm:text-7xl ${
          done ? 'animate-pulse text-rose-400' : 'text-orange-200'
        }`}
      >
        {formatTimer(shown)}
      </div>

      {!started && (
        <>
          <div className="flex items-end gap-2">
            <Field label={t('timer.hours')} value={h} onChange={setH} max={99} />
            <span className="pb-2 text-2xl text-neutral-500">:</span>
            <Field label={t('timer.minutes')} value={m} onChange={setM} max={59} />
            <span className="pb-2 text-2xl text-neutral-500">:</span>
            <Field label={t('timer.seconds')} value={s} onChange={setS} max={59} />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setPreset(min)}
                className="rounded-lg bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:bg-neutral-700"
              >
                {min} min
              </button>
            ))}
          </div>
        </>
      )}

      {done && <p className="text-lg font-semibold text-rose-300">{t('timer.done')}</p>}

      <div className="flex w-full max-w-xs gap-3">
        {!started ? (
          <button
            type="button"
            onClick={start}
            disabled={total <= 0}
            className="flex-1 rounded-xl bg-orange-500 py-3 text-lg font-semibold text-neutral-900 transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('btn.start')}
          </button>
        ) : done ? (
          <button
            type="button"
            onClick={reset}
            className="flex-1 rounded-xl bg-orange-500 py-3 font-semibold text-neutral-900 transition-colors hover:bg-orange-400"
          >
            {t('btn.dismiss')}
          </button>
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
              onClick={togglePause}
              className={`flex-1 rounded-xl py-3 font-semibold transition-colors ${
                running
                  ? 'bg-amber-500 text-neutral-900 hover:bg-amber-400'
                  : 'bg-orange-500 text-neutral-900 hover:bg-orange-400'
              }`}
            >
              {running ? t('btn.pause') : t('btn.resume')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
}) {
  return (
    <label className="flex flex-col items-center gap-1">
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Math.max(0, Math.min(max, Math.floor(Number(e.target.value) || 0)));
          onChange(n);
        }}
        className="w-20 rounded-lg border border-white/10 bg-neutral-900 py-2 text-center font-mono text-3xl tabular-nums focus:border-orange-400 focus:outline-none"
      />
      <span className="text-xs uppercase tracking-wide text-neutral-500">{label}</span>
    </label>
  );
}
