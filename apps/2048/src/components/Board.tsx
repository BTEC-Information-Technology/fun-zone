import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FitBox } from '@funzone/ui';
import { type Board as BoardT, type Dir, hasMoves, move, newGame, spawn } from '../lib/game2048';

const BEST_KEY = 'funzone:2048:best';
const MAX_UNDO = 3;

interface Snapshot {
  board: BoardT;
  score: number;
}

const TILE_STYLES: Record<number, string> = {
  0: 'bg-white/5 text-transparent',
  2: 'bg-[#1d2a44] text-amber-50',
  4: 'bg-[#243a5e] text-amber-50',
  8: 'bg-[#2f6f8f] text-white',
  16: 'bg-[#2f8f7a] text-white',
  32: 'bg-[#3fae5a] text-white',
  64: 'bg-[#8faf3f] text-white',
  128: 'bg-[#c79a3a] text-white',
  256: 'bg-[#d98a2b] text-white',
  512: 'bg-[#e0712b] text-white',
  1024: 'bg-[#e6532b] text-white',
  2048: 'bg-[#f5b301] text-neutral-900 ring-2 ring-amber-200',
};

function tileClass(v: number): string {
  return TILE_STYLES[v] ?? 'bg-[#b5172b] text-white';
}

function tileFont(v: number): string {
  if (v >= 1024) return 'text-2xl sm:text-3xl';
  if (v >= 128) return 'text-3xl sm:text-4xl';
  return 'text-4xl sm:text-5xl';
}

export function Board() {
  const { t } = useTranslation();
  const [board, setBoard] = useState<BoardT>(() => newGame());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => Number(localStorage.getItem(BEST_KEY) ?? 0));
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [won, setWon] = useState(false);
  const [dismissedWin, setDismissedWin] = useState(false);

  const gameOver = !hasMoves(board);

  useEffect(() => {
    if (score > best) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
  }, [score, best]);

  const reset = useCallback(() => {
    setBoard(newGame());
    setScore(0);
    setHistory([]);
    setWon(false);
    setDismissedWin(false);
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setBoard(prev.board);
      setScore(prev.score);
      return h.slice(0, -1);
    });
  }, []);

  const doMove = useCallback(
    (dir: Dir) => {
      setBoard((cur) => {
        const { board: moved, gained, moved: didMove } = move(cur, dir);
        if (!didMove) return cur;
        const next = spawn(moved);
        setHistory((h) => [...h, { board: cur, score }].slice(-MAX_UNDO));
        setScore((s) => s + gained);
        if (!won && next.some((row) => row.some((v) => v >= 2048))) setWon(true);
        return next;
      });
    },
    [score, won],
  );

  // Keyboard
  useEffect(() => {
    const keys: Record<string, Dir> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
      a: 'left',
      d: 'right',
      w: 'up',
      s: 'down',
    };
    const onKey = (e: KeyboardEvent) => {
      const dir = keys[e.key];
      if (dir) {
        e.preventDefault();
        doMove(dir);
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doMove, undo]);

  // Swipe
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t0 = e.touches[0];
    touch.current = { x: t0.clientX, y: t0.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t1 = e.changedTouches[0];
    const dx = t1.clientX - touch.current.x;
    const dy = t1.clientY - touch.current.y;
    touch.current = null;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < 24) return;
    if (absX > absY) doMove(dx > 0 ? 'right' : 'left');
    else doMove(dy > 0 ? 'down' : 'up');
  };

  const showWin = won && !dismissedWin;
  const showOver = gameOver && !showWin;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2 landscape:h-full landscape:max-w-[calc(100dvh-7rem)]">
      {/* HUD */}
      <div className="flex flex-none items-center gap-2">
        <div className="flex gap-2">
          <Stat label={t('hud.score')} value={score} />
          <Stat label={t('hud.best')} value={best} />
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={undo}
          disabled={history.length === 0}
          className="rounded-lg bg-neutral-700 px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('btn.undo')} ({history.length}/{MAX_UNDO})
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-amber-400"
        >
          {t('btn.newGame')}
        </button>
      </div>

      {/* Board */}
      <FitBox ratio={1}>
        <div
          className="relative h-full w-full touch-none select-none rounded-2xl bg-neutral-800/60 p-2"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-2">
          {board.flat().map((v, i) => (
            <div
              key={i}
              className={`flex items-center justify-center rounded-lg font-bold tabular-nums transition-colors ${tileClass(v)} ${tileFont(v)}`}
            >
              {v || ''}
            </div>
          ))}
        </div>

        {(showOver || showWin) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-neutral-950/80 backdrop-blur-sm">
            <p className="text-2xl font-bold text-amber-300">{showWin ? t('over.won') : t('over.title')}</p>
            <p className="text-lg text-neutral-300">
              {t('hud.score')}: <span className="font-semibold text-white">{score}</span>
            </p>
            {showWin ? (
              <button
                type="button"
                onClick={() => setDismissedWin(true)}
                className="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-amber-400"
              >
                {t('over.keepGoing')}
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-amber-400"
              >
                {t('over.tryAgain')}
              </button>
            )}
          </div>
        )}
        </div>
      </FitBox>

      <p className="flex-none text-center text-xs text-neutral-500">{t('hint')}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-16 rounded-lg bg-neutral-800 px-3 py-1.5 text-center">
      <div className="text-[10px] uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="text-lg font-bold tabular-nums text-white">{value}</div>
    </div>
  );
}
