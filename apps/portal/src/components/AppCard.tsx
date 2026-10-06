import { useTranslation } from 'react-i18next';
import type { AppEntry } from '../types';
import { localized } from '../types';
import { categoryLabel, tagLabel } from '../data/catalog';

interface Props {
  app: AppEntry;
}

export function AppCard({ app }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const available = app.url !== '';

  const open = () => {
    if (available) window.open(app.url, '_blank', 'noopener');
  };

  return (
    <button
      type="button"
      onClick={open}
      disabled={!available}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900 text-left transition-colors enabled:hover:border-white/25 disabled:cursor-default"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-indigo-600/40 to-fuchsia-600/30">
        {app.image ? (
          <img
            src={app.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform group-enabled:group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/80">
            {app.name.slice(0, 2)}
          </div>
        )}
        {!available && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-amber-300">
            {t('grid.comingSoon')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <h3 className="text-sm font-semibold leading-tight">{app.name}</h3>
        <p className="line-clamp-2 text-xs text-neutral-400">{localized(app.description, lang)}</p>
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {app.categories.map((c) => (
            <span key={c} className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-200">
              {categoryLabel(c, lang)}
            </span>
          ))}
          {app.tags.slice(0, 3).map((tg) => (
            <span key={tg} className="rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] text-neutral-400">
              {tagLabel(tg, lang)}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
