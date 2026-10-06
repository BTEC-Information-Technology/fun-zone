import { useEffect } from 'react';
import { ADSENSE, type AdPlacement, loadAdsense, slotReady } from './adsense';

interface Props {
  placement: AdPlacement;
  /** Text shown in the development placeholder (before AdSense is enabled). */
  label?: string;
  /** Extra classes on the outer container (e.g. separator/padding). */
  className?: string;
}

const FIXED: Record<'top' | 'bottom', { width: number; height: number }> = {
  top: { width: 320, height: 50 },
  bottom: { width: 300, height: 250 },
};

/**
 * Shared ad banner, driven by the screen orientation:
 *  - PORTRAIT  → `top` (320×50) and `bottom` (300×250); `side` hidden.
 *  - LANDSCAPE → `side` (responsive 160×600 vertical strip); `top`/`bottom` hidden.
 *
 * Without a valid ad unit (`slots[...]` empty) it renders a placeholder, so the
 * occupied space is visible during development / before AdSense approval.
 */
export function AdBanner({ placement, label = 'Ad', className }: Props) {
  const ready = slotReady(placement);

  useEffect(() => {
    if (!ready) return;
    loadAdsense();
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({});
    } catch {
      /* AdSense unavailable (e.g. blocked by an adblocker) — ignore. */
    }
  }, [ready]);

  // Vertical side strip — landscape only, fills the column height.
  if (placement === 'side') {
    const wrap = `hidden landscape:flex w-32 flex-none items-stretch justify-center lg:w-40 ${className ?? ''}`;
    if (!ready) {
      return (
        <div className={wrap} aria-hidden="true">
          <div className="m-2 flex flex-1 items-center justify-center rounded-md border border-dashed border-white/15 bg-white/[0.03] text-[10px] uppercase tracking-widest text-neutral-600">
            {label}
          </div>
        </div>
      );
    }
    return (
      <div className={wrap}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={ADSENSE.client}
          data-ad-slot={ADSENSE.slots.side}
          data-ad-format="vertical"
          data-full-width-responsive="false"
        />
      </div>
    );
  }

  // Horizontal banner (top/bottom) — portrait only.
  const { width, height } = FIXED[placement];
  const wrap = `flex w-full flex-none items-center justify-center landscape:hidden ${className ?? ''}`;
  if (!ready) {
    return (
      <div className={wrap} aria-hidden="true">
        <div
          className="flex items-center justify-center rounded-md border border-dashed border-white/15 bg-white/[0.03] text-[10px] uppercase tracking-widest text-neutral-600"
          style={{ width, height, maxWidth: '100%' }}
        >
          {label} {width}×{height}
        </div>
      </div>
    );
  }
  return (
    <div className={wrap}>
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width, height, maxWidth: '100%' }}
        data-ad-client={ADSENSE.client}
        data-ad-slot={ADSENSE.slots[placement]}
      />
    </div>
  );
}
