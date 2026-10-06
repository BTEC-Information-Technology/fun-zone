import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber, grandTotal, lineTotal, type Item } from '../lib/parse';
import { ItemForm, type FormData } from './ItemForm';

const KEY = 'funzone:shopping:list';

function load(): Item[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as Item[]) : [];
  } catch {
    return [];
  }
}

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.floor(performance.now()).toString(36);
}

interface Editing extends FormData {
  id?: string;
}

export function ShoppingList() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>(load);
  const [editing, setEditing] = useState<Editing | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const submit = (data: { name: string; price: number; qty: number }) => {
    setItems((cur) => {
      if (editing?.id) {
        return cur.map((it) => (it.id === editing.id ? { ...it, ...data } : it));
      }
      return [...cur, { id: uid(), ...data }];
    });
    setEditing(null);
  };

  const total = grandTotal(items);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 landscape:h-full landscape:min-h-0">
      {/* Add */}
      <button
        type="button"
        onClick={() => setEditing({ name: '', price: '', qty: 1 })}
        className="flex-none rounded-xl bg-lime-500 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-lime-400"
      >
        + {t('btn.add')}
      </button>

      {/* List */}
      <div className="flex flex-col gap-2 landscape:min-h-0 landscape:flex-1 landscape:overflow-y-auto">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-neutral-500">
            {t('list.empty')}
          </p>
        ) : (
          items.map((it) => (
            <div key={it.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-neutral-100">{it.name || '—'}</div>
                <div className="text-xs text-neutral-400">
                  {formatNumber(it.price)} × {it.qty} {t('list.each')}
                </div>
              </div>
              <div className="font-mono font-semibold tabular-nums text-lime-300">{formatNumber(lineTotal(it))}</div>
              <button
                type="button"
                onClick={() => setEditing({ id: it.id, name: it.name, price: formatNumber(it.price), qty: it.qty })}
                aria-label="edit"
                className="flex-none rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100"
              >
                ✏️
              </button>
              <button
                type="button"
                onClick={() => setItems((cur) => cur.filter((x) => x.id !== it.id))}
                aria-label="delete"
                className="flex-none rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-rose-500/20 hover:text-rose-300"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* Total + reset */}
      <div className="flex flex-none items-center justify-between gap-3 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => {
            if (items.length === 0 || window.confirm(t('reset.confirm'))) setItems([]);
          }}
          disabled={items.length === 0}
          className="rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-700 disabled:opacity-40"
        >
          {t('btn.reset')}
        </button>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-neutral-400">{t('list.total')}</span>
          <span className="font-mono text-2xl font-bold tabular-nums text-lime-300">{formatNumber(total)}</span>
        </div>
      </div>

      {editing && (
        <ItemForm
          initial={{ name: editing.name, price: editing.price, qty: editing.qty }}
          onSubmit={submit}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
