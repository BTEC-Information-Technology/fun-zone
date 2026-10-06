import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrivacyPolicy } from '@funzone/ui';
import { AppBar } from './components/AppBar';
import { AppGrid } from './components/AppGrid';
import { FilterPanel } from './components/FilterPanel';
import { CATALOG, CATEGORIES } from './data/catalog';
import { filterApps, sortByName } from './lib/filter';

// Local admin — DEV-only, at #/admin (never shown in production).
const AdminPanel = lazy(() => import('./dev/AdminPanel'));

function useIsAdminRoute() {
  const isAdmin = () => window.location.hash === '#/admin';
  const [admin, setAdmin] = useState(isAdmin);
  useEffect(() => {
    const onHash = () => setAdmin(isAdmin());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return admin;
}

interface Applied {
  categories: string[];
  tags: string[];
}

export default function App() {
  const { t, i18n } = useTranslation();
  const isAdminRoute = useIsAdminRoute();
  const isPrivacy = window.location.pathname.replace(/\/+$/, '') === '/privacy';

  const [applied, setApplied] = useState<Applied>({ categories: [], tags: [] });
  const [nameQuery, setNameQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Only the published apps (with a URL) — no "coming soon" cards.
  const published = useMemo(() => CATALOG.filter((app) => app.url.trim() !== ''), []);
  const items = useMemo(
    () => sortByName(filterApps(published, CATEGORIES, applied.categories, applied.tags, nameQuery)),
    [published, applied, nameQuery],
  );

  useEffect(() => {
    setPage(1);
  }, [applied, nameQuery]);

  if (import.meta.env.DEV && isAdminRoute) {
    return (
      <Suspense fallback={null}>
        <AdminPanel />
      </Suspense>
    );
  }

  if (isPrivacy) {
    return (
      <div className="flex h-full flex-col">
        <header className="flex h-12 flex-none items-center gap-3 border-b border-white/10 px-3">
          <a href="/" className="text-sm text-sky-400 hover:underline">
            {t('nav.back')}
          </a>
          <span className="font-semibold tracking-wide">fun-zone</span>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">
          <PrivacyPolicy lang={i18n.language} />
        </main>
      </div>
    );
  }

  const activeFilters = applied.categories.length + applied.tags.length;

  return (
    <div className="flex h-full flex-col">
      <AppBar onOpenFilters={() => setFilterOpen(true)} activeFilters={activeFilters} />
      <div className="flex min-h-0 flex-1">
        {filterOpen && (
          <FilterPanel
            onClose={() => setFilterOpen(false)}
            initialCategories={applied.categories}
            initialTags={applied.tags}
            onApply={(categories, tags) => setApplied({ categories, tags })}
          />
        )}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <AppGrid
            items={items}
            page={page}
            onPageChange={setPage}
            query={nameQuery}
            onQueryChange={setNameQuery}
          />
        </main>
      </div>
      <footer className="flex-none border-t border-white/10 px-4 py-2 text-center text-xs text-neutral-500">
        <a href="/privacy" className="underline hover:text-neutral-300">
          {t('nav.privacy')}
        </a>
      </footer>
    </div>
  );
}
