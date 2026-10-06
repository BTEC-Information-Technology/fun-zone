import { useState } from 'react';
import type { Tag } from '../types';
import { TAGS } from '../data/catalog';
import { saveData } from './adminApi';

const input = 'rounded border border-white/15 bg-neutral-800 px-2 py-1 text-sm outline-none focus:border-indigo-500';

export function TagEditor() {
  const [items, setItems] = useState<Tag[]>(() => TAGS.map((t) => ({ id: t.id, label: { ...t.label } })));
  const [status, setStatus] = useState('');

  const update = (i: number, patch: Partial<Tag>) =>
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const save = async () => {
    const cleaned = items.map((it) => ({ ...it, id: it.id.trim() }));
    const ids = cleaned.map((i) => i.id);
    if (ids.some((id) => id === '')) {
      setStatus('Error: all ids must be filled in.');
      return;
    }
    if (new Set(ids).size !== ids.length) {
      setStatus('Error: duplicate ids.');
      return;
    }
    try {
      await saveData('tags', cleaned);
      setStatus('Saved. Reloading.');
    } catch (e) {
      setStatus(String(e));
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2">
      {items.map((it, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2">
          <input
            value={it.id}
            onChange={(e) => update(i, { id: e.target.value })}
            placeholder="id"
            className={`${input} w-36`}
          />
          <input
            value={it.label.ro}
            onChange={(e) => update(i, { label: { ...it.label, ro: e.target.value } })}
            placeholder="RO"
            className={`${input} w-40`}
          />
          <input
            value={it.label.en}
            onChange={(e) => update(i, { label: { ...it.label, en: e.target.value } })}
            placeholder="EN"
            className={`${input} w-40`}
          />
          <button
            type="button"
            onClick={() => setItems((arr) => arr.filter((_, idx) => idx !== i))}
            className="rounded border border-rose-500/40 px-2 py-1 text-xs text-rose-200 hover:bg-rose-950/40"
          >
            delete
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setItems((arr) => [...arr, { id: '', label: { ro: '', en: '' } }])}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
        >
          + Tag
        </button>
        <button
          type="button"
          onClick={save}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Save
        </button>
        {status && <span className="text-sm text-neutral-400">{status}</span>}
      </div>
    </div>
  );
}
