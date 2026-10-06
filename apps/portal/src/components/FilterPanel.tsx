import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, TAGS } from '../data/catalog';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { CategoryTree } from './CategoryTree';
import { TagList } from './TagList';
import { ChevronRightIcon, CloseIcon } from './icons';

interface Props {
  onClose: () => void;
  initialCategories: string[];
  initialTags: string[];
  onApply: (categories: string[], tags: string[]) => void;
}

export function FilterPanel({ onClose, initialCategories, initialTags, onApply }: Props) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [cats, setCats] = useState<string[]>(initialCategories);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [section, setSection] = useState<'categories' | 'tags'>('categories');

  // Resizing (desktop only).
  const [width, setWidth] = useState(300);
  const resizingRef = useRef(false);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!resizingRef.current) return;
      setWidth(Math.min(480, Math.max(220, e.clientX)));
    };
    const up = () => {
      resizingRef.current = false;
      document.body.style.userSelect = '';
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  const apply = () => {
    onApply(cats, tags);
    onClose();
  };

  const SectionHeader = ({ id, label }: { id: 'categories' | 'tags'; label: string }) => (
    <button
      type="button"
      onClick={() => setSection(id)}
      className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left font-medium"
    >
      <span>{label}</span>
      <ChevronRightIcon className={`h-4 w-4 transition-transform ${section === id ? 'rotate-90' : ''}`} />
    </button>
  );

  return (
    <aside
      style={isDesktop ? { width } : undefined}
      className={
        isDesktop
          ? 'relative h-full shrink-0 overflow-hidden border-r border-white/10 bg-neutral-950'
          : 'fixed inset-0 z-50 bg-neutral-950'
      }
    >
      <div className="flex h-full flex-col">
        <header className="flex flex-none items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-lg font-semibold">{t('filters.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('a11y.closeFilters')}
            className="rounded-md p-1 text-neutral-300 hover:bg-white/10"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <SectionHeader id="categories" label={t('filters.categories')} />
          {section === 'categories' && (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <CategoryTree tree={CATEGORIES} selected={cats} onChange={setCats} />
              </div>
              <div className="flex-none border-t border-white/10 p-3">
                <button
                  type="button"
                  onClick={() => setSection('tags')}
                  className="w-full rounded-lg border border-white/15 px-4 py-1.5 text-sm hover:bg-white/10"
                >
                  {t('filters.ok')}
                </button>
              </div>
            </div>
          )}

          <SectionHeader id="tags" label={t('filters.tags')} />
          {section === 'tags' && (
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <TagList tags={TAGS} selected={tags} onChange={setTags} />
            </div>
          )}
        </div>

        <footer className="flex-none border-t border-white/10 p-3">
          <button
            type="button"
            onClick={apply}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            {t('filters.apply')}
          </button>
        </footer>
      </div>

      {/* Resize handle (desktop) */}
      {isDesktop && (
        <div
          onPointerDown={() => {
            resizingRef.current = true;
            document.body.style.userSelect = 'none';
          }}
          className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-white/5 hover:bg-indigo-500"
        />
      )}
    </aside>
  );
}
