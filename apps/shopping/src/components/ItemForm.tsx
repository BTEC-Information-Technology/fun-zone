import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface FormData {
  name: string;
  price: string;
  qty: number;
}

interface Props {
  initial: FormData;
  onSubmit: (data: { name: string; price: number; qty: number }) => void;
  onCancel: () => void;
}

export function ItemForm({ initial, onSubmit, onCancel }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(initial.name);
  const [price, setPrice] = useState(initial.price);
  const [qty, setQty] = useState(initial.qty);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    nameRef.current?.select();
  }, []);

  const submit = () => {
    const p = parseFloat(price.replace(',', '.'));
    onSubmit({ name: name.trim(), price: Number.isFinite(p) ? p : 0, qty: Math.max(1, qty) });
  };

  const inputCls =
    'w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2.5 text-base focus:border-lime-400 focus:outline-none';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-4"
      onClick={onCancel}
    >
      <div
        className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-neutral-400">{t('form.name')}</span>
          <input
            ref={nameRef}
            type="text"
            value={name}
            placeholder={t('form.namePh')}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm text-neutral-400">{t('form.price')}</span>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${inputCls} text-right font-mono tabular-nums`}
          />
        </label>

        <div className="mb-5">
          <span className="mb-1 block text-sm text-neutral-400">{t('form.qty')}</span>
          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-12 flex-none rounded-lg bg-neutral-700 text-2xl font-bold transition-colors hover:bg-neutral-600"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
              className={`${inputCls} text-center font-mono text-xl tabular-nums`}
            />
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-12 flex-none rounded-lg bg-neutral-700 text-2xl font-bold transition-colors hover:bg-neutral-600"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg bg-neutral-700 py-2.5 font-medium transition-colors hover:bg-neutral-600"
          >
            {t('btn.cancel')}
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex-1 rounded-lg bg-lime-500 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-lime-400"
          >
            {t('btn.ok')}
          </button>
        </div>
      </div>
    </div>
  );
}
