import { useState } from 'react';
import { CatalogEditor } from './CatalogEditor';
import { CategoryTreeEditor } from './CategoryTreeEditor';
import { TagEditor } from './TagEditor';

type Tab = 'catalog' | 'categories' | 'tags';

const TABS: { key: Tab; label: string }[] = [
  { key: 'catalog', label: 'Apps' },
  { key: 'categories', label: 'Categories' },
  { key: 'tags', label: 'Tags' },
];

/** Local portal admin (dev-only). Publishes automatically to src/data/*.json. */
export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('catalog');

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h1 className="text-xl font-semibold">Admin portal (DEV)</h1>
        <a href="#/" className="text-sm text-indigo-300 underline">
          ← back to portal
        </a>
      </header>

      <nav className="flex gap-2 border-b border-white/10 px-4 py-2">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            type="button"
            onClick={() => setTab(tb.key)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === tb.key ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1">
        {tab === 'catalog' && <CatalogEditor />}
        {tab === 'categories' && (
          <div className="h-full overflow-y-auto p-4">
            <CategoryTreeEditor />
          </div>
        )}
        {tab === 'tags' && (
          <div className="h-full overflow-y-auto p-4">
            <TagEditor />
          </div>
        )}
      </div>
    </div>
  );
}
