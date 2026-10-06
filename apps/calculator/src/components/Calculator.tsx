import { useEffect, useState } from 'react';
import { formatNumber, operate, type Op } from '../lib/calc';

const OPS: Op[] = ['÷', '×', '−', '+'];

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [overwrite, setOverwrite] = useState(true);

  const inputDigit = (d: string) => {
    setDisplay((cur) => (overwrite || cur === '0' ? d : cur + d));
    setOverwrite(false);
  };
  const inputDot = () => {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
      return;
    }
    setDisplay((cur) => (cur.includes('.') ? cur : cur + '.'));
  };
  const clearAll = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setOverwrite(true);
  };
  const toggleSign = () =>
    setDisplay((cur) => (cur.startsWith('-') ? cur.slice(1) : cur === '0' ? cur : '-' + cur));
  const percent = () => {
    setDisplay((cur) => formatNumber(Number(cur) / 100));
    setOverwrite(true);
  };
  const backspace = () => {
    if (overwrite) return;
    setDisplay((cur) => {
      const next = cur.slice(0, -1);
      return next === '' || next === '-' ? '0' : next;
    });
  };
  const chooseOp = (nextOp: Op) => {
    const current = Number(display);
    if (prev !== null && op && !overwrite) {
      const result = operate(prev, op, current);
      setPrev(result);
      setDisplay(formatNumber(result));
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setOverwrite(true);
  };
  const equals = () => {
    if (prev === null || op === null) return;
    setDisplay(formatNumber(operate(prev, op, Number(display))));
    setPrev(null);
    setOp(null);
    setOverwrite(true);
  };

  const press = (key: string) => {
    if (/^[0-9]$/.test(key)) inputDigit(key);
    else if (key === '.') inputDot();
    else if (key === 'C') clearAll();
    else if (key === '±') toggleSign();
    else if (key === '%') percent();
    else if (key === '=') equals();
    else if (OPS.includes(key as Op)) chooseOp(key as Op);
  };

  // Keyboard
  useEffect(() => {
    const map: Record<string, string> = { '*': '×', x: '×', '/': '÷', '-': '−', '+': '+' };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) press(k);
      else if (k === '.' || k === ',') press('.');
      else if (k in map) press(map[k]);
      else if (k === 'Enter' || k === '=') press('=');
      else if (k === 'Escape') press('C');
      else if (k === 'Backspace') backspace();
      else if (k === '%') press('%');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const fnKey = 'rounded-xl bg-neutral-700 py-4 text-lg font-medium transition-colors hover:bg-neutral-600';
  const numKey = 'rounded-xl bg-neutral-800 py-4 text-lg font-medium transition-colors hover:bg-neutral-700';
  const opKey = 'rounded-xl bg-cyan-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-cyan-500';

  const Btn = ({ k, cls, span }: { k: string; cls: string; span?: boolean }) => (
    <button type="button" onClick={() => press(k)} className={`${cls} ${span ? 'col-span-2' : ''}`}>
      {k}
    </button>
  );

  return (
    <div className="mx-auto flex w-full flex-col gap-3 landscape:max-w-xs">
      <div className="flex min-h-[5rem] items-end justify-end overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-right text-4xl font-light tabular-nums">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Btn k="C" cls={fnKey} />
        <Btn k="±" cls={fnKey} />
        <Btn k="%" cls={fnKey} />
        <Btn k="÷" cls={opKey} />
        <Btn k="7" cls={numKey} />
        <Btn k="8" cls={numKey} />
        <Btn k="9" cls={numKey} />
        <Btn k="×" cls={opKey} />
        <Btn k="4" cls={numKey} />
        <Btn k="5" cls={numKey} />
        <Btn k="6" cls={numKey} />
        <Btn k="−" cls={opKey} />
        <Btn k="1" cls={numKey} />
        <Btn k="2" cls={numKey} />
        <Btn k="3" cls={numKey} />
        <Btn k="+" cls={opKey} />
        <Btn k="0" cls={numKey} span />
        <Btn k="." cls={numKey} />
        <Btn k="=" cls={opKey} />
      </div>
    </div>
  );
}
