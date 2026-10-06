import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FitBox } from '@funzone/ui';
import { DIFFICULTIES, findConflicts, generatePuzzle, isSolved, peers, type Grid } from '../lib/sudoku';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function SudokuGame() {
  const { t } = useTranslation();
  const [diffIdx, setDiffIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<Grid>(() => new Array(81).fill(0));
  const [values, setValues] = useState<Grid>(() => new Array(81).fill(0));
  const [notes, setNotes] = useState<number[][]>(() => Array.from({ length: 81 }, () => []));
  const [selected, setSelected] = useState<number | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [won, setWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

  const given = useMemo(() => puzzle.map((v) => v !== 0), [puzzle]);
  const conflicts = useMemo(() => findConflicts(values), [values]);
  const counts = useMemo(() => {
    const c = new Array(10).fill(0);
    for (const v of values) if (v) c[v]++;
    return c;
  }, [values]);

  const newGame = useCallback((idx: number) => {
    setLoading(true);
    setWon(false);
    setSelected(null);
    setTimeout(() => {
      const { puzzle: p } = generatePuzzle(DIFFICULTIES[idx]);
      setPuzzle(p);
      setValues(p.slice());
      setNotes(Array.from({ length: 81 }, () => []));
      setElapsed(0);
      startRef.current = performance.now();
      setLoading(false);
    }, 20);
  }, []);

  useEffect(() => {
    newGame(0);
  }, [newGame]);

  useEffect(() => {
    if (loading || won) return;
    const id = setInterval(() => setElapsed(Math.floor((performance.now() - startRef.current) / 1000)), 250);
    return () => clearInterval(id);
  }, [loading, won]);

  const changeDiff = (idx: number) => {
    setDiffIdx(idx);
    newGame(idx);
  };

  const enter = (n: number) => {
    if (selected == null || won) return;
    const idx = selected;
    if (given[idx]) return;
    if (notesMode) {
      setNotes((ns) => {
        const c = ns.map((a) => a.slice());
        const cell = c[idx];
        const at = cell.indexOf(n);
        if (at >= 0) cell.splice(at, 1);
        else {
          cell.push(n);
          cell.sort();
        }
        return c;
      });
      return;
    }
    const nv = values.slice();
    nv[idx] = values[idx] === n ? 0 : n;
    setValues(nv);
    setNotes((ns) => {
      const c = ns.map((a) => a.slice());
      c[idx] = [];
      return c;
    });
    if (isSolved(nv)) setWon(true);
  };

  const erase = () => {
    if (selected == null || won) return;
    const idx = selected;
    if (given[idx]) return;
    const nv = values.slice();
    nv[idx] = 0;
    setValues(nv);
    setNotes((ns) => {
      const c = ns.map((a) => a.slice());
      c[idx] = [];
      return c;
    });
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') enter(Number(e.key));
      else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') erase();
      else if (selected != null) {
        const r = Math.floor(selected / 9);
        const c = selected % 9;
        if (e.key === 'ArrowUp' && r > 0) setSelected(selected - 9);
        else if (e.key === 'ArrowDown' && r < 8) setSelected(selected + 9);
        else if (e.key === 'ArrowLeft' && c > 0) setSelected(selected - 1);
        else if (e.key === 'ArrowRight' && c < 8) setSelected(selected + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const selPeers = selected != null ? new Set(peers(selected)) : new Set<number>();
  const selVal = selected != null ? values[selected] : 0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 landscape:h-full landscape:max-w-[calc(100dvh-12rem)]">
      {/* Toolbar */}
      <div className="flex flex-none items-center gap-2">
        <div className="flex flex-1 gap-1 rounded-xl bg-neutral-800 p-1">
          {DIFFICULTIES.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onClick={() => changeDiff(i)}
              className={`flex-1 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                diffIdx === i ? 'bg-emerald-500 text-neutral-900' : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              {t(`diff.${d.id}`)}
            </button>
          ))}
        </div>
        <span className="w-12 text-right font-mono text-sm tabular-nums text-neutral-300">{fmt(elapsed)}</span>
      </div>

      {/* Grid */}
      <FitBox ratio={1}>
        <div className="relative h-full w-full">
          <div
            className="grid h-full w-full overflow-hidden rounded-lg border-2 border-neutral-500"
            style={{ gridTemplateColumns: 'repeat(9,minmax(0,1fr))', gridTemplateRows: 'repeat(9,minmax(0,1fr))' }}
          >
            {values.map((v, i) => {
              const r = Math.floor(i / 9);
              const c = i % 9;
              const isGiven = given[i];
              const sel = selected === i;
              const inHL = selected != null && (selPeers.has(i) || sel);
              const sameVal = v !== 0 && v === selVal;
              const bad = conflicts[i];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  style={{
                    borderRight: c % 3 === 2 && c !== 8 ? '2px solid #6b7280' : '1px solid #1f2937',
                    borderBottom: r % 3 === 2 && r !== 8 ? '2px solid #6b7280' : '1px solid #1f2937',
                  }}
                  className={`relative flex items-center justify-center [container-type:size] ${
                    sel
                      ? 'bg-emerald-500/30'
                      : sameVal
                        ? 'bg-emerald-500/15'
                        : inHL
                          ? 'bg-white/[0.06]'
                          : 'bg-neutral-900'
                  }`}
                >
                  {v !== 0 ? (
                    <span
                      className={`text-[58cqmin] font-semibold leading-none ${
                        bad ? 'text-rose-400' : isGiven ? 'text-neutral-100' : 'text-emerald-300'
                      }`}
                    >
                      {v}
                    </span>
                  ) : notes[i].length > 0 ? (
                    <div className="grid h-full w-full grid-cols-3 grid-rows-3 p-[6%] text-neutral-400">
                      {DIGITS.map((n) => (
                        <span key={n} className="flex items-center justify-center text-[24cqmin] leading-none">
                          {notes[i].includes(n) ? n : ''}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-neutral-950/70 text-neutral-300">
              {t('loading')}
            </div>
          )}
          {won && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-neutral-950/85 backdrop-blur-sm">
              <p className="text-3xl font-bold text-emerald-300">{t('win.title')}</p>
              <p className="text-neutral-200">{fmt(elapsed)}</p>
              <button
                type="button"
                onClick={() => newGame(diffIdx)}
                className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-emerald-400"
              >
                {t('btn.again')}
              </button>
            </div>
          )}
        </div>
      </FitBox>

      {/* Digit pad + actions */}
      <div className="flex flex-none flex-col gap-2">
        <div className="grid grid-cols-9 gap-1">
          {DIGITS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => enter(n)}
              disabled={counts[n] >= 9}
              className="aspect-square rounded-lg bg-neutral-800 text-lg font-semibold text-emerald-200 transition-colors hover:bg-neutral-700 disabled:opacity-30"
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setNotesMode((m) => !m)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              notesMode ? 'bg-emerald-500 text-neutral-900' : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
            }`}
          >
            ✏️ {t('btn.notes')}
            {notesMode ? ' ✓' : ''}
          </button>
          <button
            type="button"
            onClick={erase}
            className="flex-1 rounded-lg bg-neutral-800 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            {t('btn.erase')}
          </button>
          <button
            type="button"
            onClick={() => newGame(diffIdx)}
            className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-emerald-400"
          >
            {t('btn.newGame')}
          </button>
        </div>
      </div>
    </div>
  );
}
