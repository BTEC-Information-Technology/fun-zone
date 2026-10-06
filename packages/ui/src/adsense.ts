/**
 * AdSense configuration for the whole platform.
 *
 * The publisher ID comes from the `VITE_ADSENSE_CLIENT` build variable (e.g.
 * 'ca-pub-1234567890123456'); do not edit `client` by hand. After the AdSense
 * account is approved:
 *  1. set `VITE_ADSENSE_CLIENT` in the build environment;
 *  2. fill in `slots.top` and `slots.bottom` with the `data-ad-slot` values of
 *     the two ad units (top banner + bottom rectangle).
 *
 * While `client` is empty, `AdBanner` renders a placeholder (in dev and in
 * production) — no Google script is loaded.
 */
export type AdPlacement = 'top' | 'bottom' | 'side';

export const ADSENSE = {
  client: ((import.meta as { env?: Record<string, string | undefined> }).env?.VITE_ADSENSE_CLIENT ?? '').trim(),
  slots: {
    top: '', // data-ad-slot of the top banner (320×50) — after approval
    bottom: '', // data-ad-slot of the bottom rectangle (300×250) — after approval
    side: '', // data-ad-slot of the desktop side strips (160×600) — after approval
  } as Record<AdPlacement, string>,
};

/** The AdSense client is configured (the script can be loaded / ads.txt is valid). */
export function adsEnabled(): boolean {
  return /^ca-pub-\d+$/.test(ADSENSE.client);
}

/** A given placement is ready to serve (we also have the ad unit). */
export function slotReady(placement: AdPlacement): boolean {
  return adsEnabled() && ADSENSE.slots[placement].length > 0;
}

let loaded = false;

/** Injects the AdSense script once (only if there is a valid client). */
export function loadAdsense(): void {
  if (loaded || typeof document === 'undefined' || !adsEnabled()) return;
  loaded = true;
  // The script may already be present in <head> (from index.html) — do not duplicate it.
  if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.client}`;
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
}
