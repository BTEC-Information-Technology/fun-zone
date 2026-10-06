import { useTranslation } from 'react-i18next';
import type { AppEntry } from '../types';
import { AppCard } from './AppCard';
import { Pagination } from './Pagination';
import { AdSlot } from './AdSlot';

const PAGE_SIZE = 12;

interface Props {
  items: AppEntry[];
  page: number;
  onPageChange: (page: number) => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export function AppGrid({ items, page, onPageChange, query, onQueryChange }: Props) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);
  const isLastPage = current >= totalPages;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      {/* Search by name + counter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('search.apps')}
          className="w-full rounded-lg border border-white/15 bg-neutral-800 px-3 py-2 text-sm outline-none placeholder:text-neutral-500 focus:border-indigo-500 sm:max-w-xs"
        />
        <span className="text-xs text-neutral-500">{t('grid.results', { count: items.length })}</span>
      </div>

      {/* Top ad */}
      <AdSlot slot="top" />

      {items.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-10 text-center text-sm text-neutral-400">
          {t('grid.noResults')}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {pageItems.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>

          {/* Ad after each page */}
          <AdSlot slot="between" />

          <Pagination page={current} total={totalPages} onChange={onPageChange} />

          {/* Ad at the end of the list */}
          {isLastPage && <AdSlot slot="end" />}
        </>
      )}
    </div>
  );
}
