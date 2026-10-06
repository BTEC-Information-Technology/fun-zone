import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FitBox } from '@funzone/ui';
import {
  bestMove,
  emptyBoard,
  isFull,
  other,
  randomMove,
  winner,
  type Player,
} from '../lib/tictactoe';

type Mode = 'two' | 'ai';
type Difficulty = 'easy' | 'hard';

export function Game() {
  const { t } = useTranslation();
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState<Player>('X');
  const [mode, setMode] = useState<Mode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });

  const win = winner(board);
  const full = isFull(board);
  const over = !!win || full;
  const counted = useRef(false);

  const newRound = () => {
    setBoard(emptyBoard());
    setTurn('X');
    counted.current = false;
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    newRound();
  };
  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    newRound();
  };

  // Count the result only once
  useEffect(() => {
    if (over && !counted.current) {
      counted.current = true;
      setScore((s) => (win ? { ...s, [win.player]: s[win.player] + 1 } : { ...s, draw: s.draw + 1 }));
    }
  }, [over, win]);

  // Computer move (O)
  useEffect(() => {
    if (mode !== 'ai' || over || turn !== 'O') return;
    const id = setTimeout(() => {
      const m = difficulty === 'hard' ? bestMove(board, 'O') : randomMove(board);
      if (m >= 0) {
        setBoard((b) => {
          const nb = b.slice();
          nb[m] = 'O';
          return nb;
        });
        setTurn('X');
      }
    }, 450);
    return () => clearTimeout(id);
  }, [mode, over, turn, board, difficulty]);

  const place = (i: number) => {
    if (over || board[i]) return;
    if (mode === 'ai' && turn === 'O') return;
    setBoard((b) => {
      const nb = b.slice();
      nb[i] = turn;
      return nb;
    });
    setTurn((tt) => other(tt));
  };

  const aiThinking = mode === 'ai' && turn === 'O' && !over;
  const status = win
    ? t('result.win', { player: win.player })
    : full
      ? t('result.draw')
      : aiThinking
        ? t('turn.thinking')
        : turn === 'X'
          ? t('turn.x')
          : t('turn.o');

  const winLine = win?.line ?? [];

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4 landscape:h-full">
      {/* Mode + difficulty selectors */}
      <div className="flex flex-none flex-col gap-2">
        <Segment
          label={t('mode.label')}
          value={mode}
          options={[
            { value: 'ai', label: t('mode.vsAi') },
            { value: 'two', label: t('mode.twoPlayers') },
          ]}
          onChange={(v) => changeMode(v as Mode)}
        />
        {mode === 'ai' && (
          <Segment
            label={t('diff.label')}
            value={difficulty}
            options={[
              { value: 'easy', label: t('diff.easy') },
              { value: 'hard', label: t('diff.hard') },
            ]}
            onChange={(v) => changeDifficulty(v as Difficulty)}
          />
        )}
      </div>

      {/* Status */}
      <p className="flex-none text-center text-lg font-semibold text-violet-200">{status}</p>

      {/* Board */}
      <FitBox ratio={1}>
        <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-2">
          {board.map((cell, i) => {
            const winning = winLine.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => place(i)}
                disabled={!!cell || over || aiThinking}
                className={`flex items-center justify-center rounded-xl border text-5xl font-black transition-colors sm:text-6xl ${
                  winning ? 'border-violet-400 bg-violet-500/20' : 'border-white/10 bg-neutral-800/60'
                } ${cell ? '' : 'hover:bg-neutral-700/60'} ${
                  cell === 'X' ? 'text-violet-300' : cell === 'O' ? 'text-amber-300' : 'text-transparent'
                }`}
              >
                {cell ?? '·'}
              </button>
            );
          })}
        </div>
      </FitBox>

      {/* Score */}
      <div className="grid flex-none grid-cols-3 gap-2 text-center">
        <Stat label={mode === 'ai' ? `${t('score.x')} (👤)` : t('score.x')} value={score.X} accent="text-violet-300" />
        <Stat label={t('score.draw')} value={score.draw} accent="text-neutral-300" />
        <Stat label={mode === 'ai' ? `${t('score.o')} (🤖)` : t('score.o')} value={score.O} accent="text-amber-300" />
      </div>

      <div className="flex flex-none gap-2">
        <button
          type="button"
          onClick={newRound}
          className="flex-1 rounded-lg bg-violet-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-violet-400"
        >
          {t('btn.newRound')}
        </button>
        <button
          type="button"
          onClick={() => {
            setScore({ X: 0, O: 0, draw: 0 });
            newRound();
          }}
          className="rounded-lg bg-neutral-700 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-600"
        >
          {t('btn.resetScore')}
        </button>
      </div>
    </div>
  );
}

function Segment({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 flex-none text-sm text-neutral-400">{label}</span>
      <div className="flex flex-1 gap-1 rounded-lg bg-neutral-800 p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`flex-1 rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
              value === o.value ? 'bg-violet-500 text-white' : 'text-neutral-300 hover:bg-white/5'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-lg bg-neutral-800 px-2 py-1.5">
      <div className="truncate text-xs text-neutral-400">{label}</div>
      <div className={`text-xl font-bold tabular-nums ${accent}`}>{value}</div>
    </div>
  );
}
