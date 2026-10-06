import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, convert, displayUnit, formatResult, unitsOf, type CategoryId } from '../lib/convert';

const ICONS: Record<CategoryId, string> = {
  length: '📏',
  mass: '⚖️',
  temperature: '🌡️',
  volume: '🧪',
  area: '▦',
  speed: '🚀',
  time: '⏱️',
  data: '💾',
};

export function Converter() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<CategoryId>('length');
  const units = unitsOf(category);
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);
  const [value, setValue] = useState('1');

  const changeCategory = (c: CategoryId) => {
    const u = unitsOf(c);
    setCategory(c);
    setFrom(u[0]);
    setTo(u[1] ?? u[0]);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const result = useMemo(() => {
    const v = parseFloat(value.replace(',', '.'));
    if (!Number.isFinite(v)) return '';
    return formatResult(convert(v, category, from, to));
  }, [value, category, from, to]);

  const selectCls =
    'w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2.5 text-base text-neutral-100 focus:border-teal-400 focus:outline-none';

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      {/* Categories */}
      <div className="grid grid-cols-4 gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => changeCategory(c)}
            className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-xs transition-colors ${
              category === c
                ? 'border-teal-400 bg-teal-500/15 text-teal-200'
                : 'border-white/10 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50'
            }`}
          >
            <span className="text-xl leading-none">{ICONS[c]}</span>
            <span className="truncate">{t(`cat.${c}`)}</span>
          </button>
        ))}
      </div>

      {/* Value */}
      <label className="flex flex-col gap-1">
        <span className="text-sm text-neutral-400">{t('value')}</span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-3 text-2xl font-light tabular-nums focus:border-teal-400 focus:outline-none"
        />
      </label>

      {/* From / To with swap button */}
      <div className="flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm text-neutral-400">{t('from')}</span>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={selectCls}>
            {units.map((u) => (
              <option key={u} value={u}>
                {displayUnit(u)}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={swap}
          aria-label={t('a11y.swap')}
          className="mb-0.5 flex-none rounded-lg border border-white/10 bg-neutral-800 p-3 text-teal-300 transition-colors hover:bg-neutral-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>

        <label className="flex flex-1 flex-col gap-1">
          <span className="text-sm text-neutral-400">{t('to')}</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={selectCls}>
            {units.map((u) => (
              <option key={u} value={u}>
                {displayUnit(u)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Result */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-5 text-center">
        <div className="break-all text-4xl font-light tabular-nums text-teal-200">{result || '—'}</div>
        <div className="mt-1 text-sm text-neutral-400">{displayUnit(to)}</div>
      </div>
    </div>
  );
}
