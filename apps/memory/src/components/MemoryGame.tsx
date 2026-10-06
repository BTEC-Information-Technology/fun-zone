import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FitBox } from '@funzone/ui';
import { buildDeck, DIFFICULTIES, pairsOf, type Card } from '../lib/memory';

const SYMBOLS = ['🐶', '🐱', '🦊', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐔', '🐧', '🦉', '🦄', '🐢', '🐙', '🦋'];

const bestKey = (id: string) => `funzone:memory:best:${id}`;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export function MemoryGame() {
  const { t } = useTranslation();
  const [diffIdx, setDiffIdx] = useState(0);
  const diff = DIFFICULTIES[diffIdx];

  const [deck, setDeck] = useState<Card[]>(() => buildDeck(pairsOf(DIFFICULTIES[0])));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useState<number | null>(() => {
    const v = localStorage.getItem(bestKey(DIFFICULTIES[0].id));
    return v ? Number(v) : null;
  });
  const [isRecord, setIsRecord] = useState(false);

  const startRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!started || won) return;
    const id = setInterval(() => {
      if (startRef.current != null) setElapsed(Math.floor((performance.now() - startRef.current) / 1000));
    }, 250);
    return () => clearInterval(id);
  }, [started, won]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const reset = (d = diff) => {
    clearTimeout(timeoutRef.current);
    setDeck(buildDeck(pairsOf(d)));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
    setWon(false);
    setStarted(false);
    setElapsed(0);
    setIsRecord(false);
    startRef.current = null;
  };

  const changeDiff = (i: number) => {
    setDiffIdx(i);
    const d = DIFFICULTIES[i];
    const v = localStorage.getItem(bestKey(d.id));
    setBest(v ? Number(v) : null);
    reset(d);
  };

  const finishWin = () => {
    setWon(true);
    const time = startRef.current != null ? Math.floor((performance.now() - startRef.current) / 1000) : elapsed;
    setElapsed(time);
    if (best == null || time < best) {
      setBest(time);
      setIsRecord(true);
      localStorage.setItem(bestKey(diff.id), String(time));
    }
  };

  const flip = (i: number) => {
    if (lock || won || matched.includes(i) || flipped.includes(i) || flipped.length === 2) return;
    if (!started) {
      startRef.current = performance.now();
      setStarted(true);
    }
    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nf;
      if (deck[a].symbol === deck[b].symbol) {
        const nm = [...matched, a, b];
        setMatched(nm);
        setFlipped([]);
        if (nm.length === deck.length) finishWin();
      } else {
        setLock(true);
        timeoutRef.current = window.setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 900);
      }
    }
  };

  const isUp = (i: number) => flipped.includes(i) || matched.includes(i);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 landscape:h-full landscape:max-w-[calc(100dvh-10rem)]">
      {/* Difficulty */}
      <div className="flex flex-none gap-1 rounded-xl bg-neutral-800 p-1">
        {DIFFICULTIES.map((d, i) => (
          <button
            key={d.id}
            type="button"
            onClick={() => changeDiff(i)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
              diffIdx === i ? 'bg-sky-500 text-neutral-900' : 'text-neutral-300 hover:bg-white/5'
            }`}
          >
            {t(`diff.${d.id}`)}
          </button>
        ))}
      </div>

      {/* HUD */}
      <div className="flex flex-none items-center gap-2">
        <Stat label={t('hud.moves')} value={String(moves)} />
        <Stat label={t('hud.time')} value={fmt(elapsed)} />
        <Stat label={t('hud.best')} value={best != null ? fmt(best) : '—'} />
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-sky-400"
        >
          {t('btn.newGame')}
        </button>
      </div>

      {/* Grid */}
      <FitBox ratio={diff.cols / diff.rows}>
        <div className="relative h-full w-full">
          <div
            className="grid h-full w-full gap-1.5 sm:gap-2"
            style={{
              gridTemplateColumns: `repeat(${diff.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${diff.rows}, minmax(0, 1fr))`,
            }}
          >
            {deck.map((card, i) => {
              const up = isUp(i);
              const done = matched.includes(i);
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => flip(i)}
                  disabled={up || lock}
                  aria-label="card"
                  className="relative h-full w-full [perspective:600px]"
                >
                  <div
                    className="relative h-full w-full transition-transform duration-300 [transform-style:preserve-3d]"
                    style={{ transform: up ? 'rotateY(180deg)' : undefined }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-sky-600/80 [backface-visibility:hidden] [container-type:size]">
                      <span className="text-[34cqmin] leading-none text-sky-100/70">?</span>
                    </div>
                    <div
                      className={`absolute inset-0 flex items-center justify-center rounded-lg border border-white/10 bg-neutral-800 [backface-visibility:hidden] [container-type:size] [transform:rotateY(180deg)] ${
                        done ? 'opacity-60' : ''
                      }`}
                    >
                      <span className="text-[52cqmin] leading-none">{SYMBOLS[card.symbol]}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {won && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-neutral-950/85 p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold text-sky-300">{t('win.title')}</p>
              {isRecord && <p className="font-semibold text-amber-300">{t('win.record')}</p>}
              <p className="text-neutral-200">
                {t('win.moves', { n: moves })} · {fmt(elapsed)}
              </p>
              <button
                type="button"
                onClick={() => reset()}
                className="rounded-lg bg-sky-500 px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-sky-400"
              >
                {t('btn.again')}
              </button>
            </div>
          )}
        </div>
      </FitBox>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-14 rounded-lg bg-neutral-800 px-2.5 py-1 text-center">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="font-mono text-base font-bold tabular-nums text-white">{value}</div>
    </div>
  );
}
