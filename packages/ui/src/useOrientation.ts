import { useSyncExternalStore } from 'react';

export type Orientation = 'portrait' | 'landscape';

const QUERY = '(orientation: landscape)';

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getSnapshot(): Orientation {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches ? 'landscape' : 'portrait';
}

/** Current screen orientation, reactive to rotation. */
export function useOrientation(): Orientation {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'portrait');
}
