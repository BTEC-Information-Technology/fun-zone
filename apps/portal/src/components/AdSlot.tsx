import { useTranslation } from 'react-i18next';

interface Props {
  /** Slot identifier (top / between / end) — useful when we hook up the ad network. */
  slot: string;
  className?: string;
}

/**
 * Ad slot — placeholder for now. The ad network code (AdSense) will be injected
 * here later on the clean domain. The layout and positions are already set.
 */
export function AdSlot({ slot, className = '' }: Props) {
  const { t } = useTranslation();
  return (
    <div
      data-ad-slot={slot}
      className={`flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/5 text-xs uppercase tracking-wide text-neutral-500 ${className}`}
    >
      {t('ad.label')}
    </div>
  );
}
