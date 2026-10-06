import { useTranslation } from 'react-i18next';

interface Props {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, onChange }: Props) {
  const { t } = useTranslation();
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-2 text-sm">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-white/15 px-3 py-1.5 transition-colors enabled:hover:bg-white/10 disabled:opacity-40"
      >
        {t('pagination.prev')}
      </button>
      <span className="text-neutral-400">{t('pagination.page', { page, total })}</span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        className="rounded-lg border border-white/15 px-3 py-1.5 transition-colors enabled:hover:bg-white/10 disabled:opacity-40"
      >
        {t('pagination.next')}
      </button>
    </div>
  );
}
