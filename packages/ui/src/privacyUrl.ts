/**
 * URL of the privacy page on the current root domain.
 * E.g. on `calculator.fun-zone.app` → `https://fun-zone.app/privacy`.
 * In dev (localhost) it points to fun-zone.app.
 */
export function privacyUrl(): string {
  if (typeof window === 'undefined') return 'https://fun-zone.app/privacy';
  const h = window.location.hostname;
  if (h === 'localhost' || h.startsWith('127.') || h.endsWith('.local')) {
    return 'https://fun-zone.app/privacy';
  }
  const apex = h.split('.').slice(-2).join('.');
  return `https://${apex}/privacy`;
}
