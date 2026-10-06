import { useMemo, useState } from 'react';
import type { AppEntry } from '../types';
import { CATALOG, CATEGORIES, TAGS } from '../data/catalog';
import { flatten } from './treeOps';
import { saveData, uploadImage } from './adminApi';

interface FormState {
  id: string;
  name: string;
  url: string;
  image: string;
  descRo: string;
  descEn: string;
  categories: string[];
  tags: string[];
}

const EMPTY: FormState = {
  id: '',
  name: '',
  url: '',
  image: '',
  descRo: '',
  descEn: '',
  categories: [],
  tags: [],
};

function toForm(a: AppEntry): FormState {
  return {
    id: a.id,
    name: a.name,
    url: a.url,
    image: a.image,
    descRo: a.description.ro,
    descEn: a.description.en,
    categories: [...a.categories],
    tags: [...a.tags],
  };
}

export function CatalogEditor() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');

  const flatCats = useMemo(() => flatten(CATEGORIES), []);
  const apps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...CATALOG]
      .filter((a) => q === '' || a.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));
  const toggle = (key: 'categories' | 'tags', id: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id],
    }));

  const onUpload = async (file?: File) => {
    if (!file) return;
    const id = form.id.trim();
    if (!id) {
      setStatus('Set the id before uploading the image.');
      return;
    }
    try {
      const path = await uploadImage(id, file);
      set({ image: path });
      setStatus('Image uploaded.');
    } catch (e) {
      setStatus(String(e));
    }
  };

  const valid = form.id.trim() !== '' && form.name.trim() !== '';

  const save = async () => {
    if (!valid) {
      setStatus('Fill in id and name.');
      return;
    }
    const entry: AppEntry = {
      id: form.id.trim(),
      name: form.name.trim(),
      url: form.url.trim(),
      image: form.image.trim(),
      description: { ro: form.descRo, en: form.descEn },
      categories: form.categories,
      tags: form.tags,
    };
    const list = [...CATALOG];
    const idx = list.findIndex((a) => a.id === entry.id);
    if (idx >= 0) list[idx] = entry;
    else list.push(entry);
    try {
      await saveData('catalog', list);
      setStatus(idx >= 0 ? 'Updated. Reloading.' : 'Added. Reloading.');
    } catch (e) {
      setStatus(String(e));
    }
  };

  const remove = async () => {
    if (!CATALOG.some((a) => a.id === form.id)) return;
    if (!window.confirm(`Delete "${form.id}"?`)) return;
    try {
      await saveData(
        'catalog',
        CATALOG.filter((a) => a.id !== form.id),
      );
      setStatus('Deleted. Reloading.');
      setForm(EMPTY);
    } catch (e) {
      setStatus(String(e));
    }
  };

  const input = 'rounded-lg border border-white/15 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-indigo-500';

  return (
    <div className="flex h-full">
      {/* App list */}
      <aside className="flex w-56 flex-none flex-col border-r border-white/10">
        <div className="p-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className={`w-full ${input}`}
          />
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {apps.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => setForm(toForm(a))}
                className={`w-full truncate rounded px-2 py-1.5 text-left text-sm hover:bg-white/10 ${
                  form.id === a.id ? 'bg-white/5 font-medium' : ''
                }`}
              >
                {a.name} <span className="text-xs text-neutral-500">({a.id})</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setForm(EMPTY)}
          className="m-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          + New app
        </button>
      </aside>

      {/* Form */}
      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto flex max-w-xl flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-400">id</span>
              <input value={form.id} onChange={(e) => set({ id: e.target.value })} className={input} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-400">Name</span>
              <input value={form.name} onChange={(e) => set({ name: e.target.value })} className={input} />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-400">URL (empty = "coming soon")</span>
            <input value={form.url} onChange={(e) => set({ url: e.target.value })} className={input} />
          </label>
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-neutral-400">Card image</span>
            <div className="flex items-center gap-3">
              {form.image ? (
                <img src={form.image} alt="" className="h-16 w-16 flex-none rounded object-cover" />
              ) : (
                <div className="flex h-16 w-16 flex-none items-center justify-center rounded bg-neutral-800 text-xs text-neutral-500">
                  —
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onUpload(e.target.files?.[0])}
                className="text-sm text-neutral-300 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-white"
              />
            </div>
            <input
              value={form.image}
              onChange={(e) => set({ image: e.target.value })}
              placeholder="/images/apps/... (or upload above)"
              className={input}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-400">Description RO</span>
              <textarea value={form.descRo} onChange={(e) => set({ descRo: e.target.value })} rows={3} className={input} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-neutral-400">Description EN</span>
              <textarea value={form.descEn} onChange={(e) => set({ descEn: e.target.value })} rows={3} className={input} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-neutral-400">Categories</span>
              <div className="flex flex-col gap-0.5 rounded-lg border border-white/10 p-2">
                {flatCats.map(({ node, depth }) => (
                  <label key={node.id} className="flex items-center gap-2 text-sm" style={{ paddingLeft: depth * 12 }}>
                    <input
                      type="checkbox"
                      checked={form.categories.includes(node.id)}
                      onChange={() => toggle('categories', node.id)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <span>{node.label.ro}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-neutral-400">Tags</span>
              <div className="flex flex-col gap-0.5 rounded-lg border border-white/10 p-2">
                {TAGS.map((tg) => (
                  <label key={tg.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.tags.includes(tg.id)}
                      onChange={() => toggle('tags', tg.id)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    <span>{tg.label.ro}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={!valid}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40"
            >
              Save
            </button>
            <button
              type="button"
              onClick={remove}
              className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm text-rose-200 hover:bg-rose-950/40"
            >
              Delete
            </button>
            {status && <span className="text-sm text-neutral-400">{status}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
