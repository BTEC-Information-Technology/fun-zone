import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Tag } from '../types';
import { localized } from '../types';

interface Props {
  tags: Tag[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 flex-none items-center justify-center rounded border ${
        checked ? 'border-indigo-500 bg-indigo-600' : 'border-white/30'
      }`}
    >
      {checked && (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );
}

export function TagList({ tags, selected, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const shown = q === '' ? tags : tags.filter((tg) => localized(tg.label, lang).toLowerCase().includes(q));

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search.tags')}
        className="flex-none rounded-lg border border-white/15 bg-neutral-800 px-3 py-1.5 text-sm outline-none placeholder:text-neutral-500 focus:border-indigo-500"
      />
      <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
        <li>
          <button
            type="button"
            onClick={() => onChange([])}
            className="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-sm transition-colors hover:bg-white/10"
          >
            <Checkbox checked={selected.length === 0} />
            <span className="font-medium">{t('filters.showAll')}</span>
          </button>
        </li>
        {shown.map((tg) => (
          <li key={tg.id}>
            <button
              type="button"
              onClick={() => toggle(tg.id)}
              className="flex w-full items-center gap-2 rounded px-1 py-1 text-left text-sm transition-colors hover:bg-white/10"
            >
              <Checkbox checked={selected.includes(tg.id)} />
              <span>{localized(tg.label, lang)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
