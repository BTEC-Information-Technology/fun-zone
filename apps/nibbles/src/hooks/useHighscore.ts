import { useCallback, useState } from 'react';

const KEY = 'nibbles:highscore';

/** The high score (a single score) saved in local storage. */
export function useHighscore() {
  const [best, setBest] = useState<number>(() => {
    const v = Number(localStorage.getItem(KEY));
    return Number.isFinite(v) ? v : 0;
  });

  /** Submits a score; returns true if it is a new record. */
  const submit = useCallback(
    (score: number): boolean => {
      if (score > best) {
        setBest(score);
        localStorage.setItem(KEY, String(score));
        return true;
      }
      return false;
    },
    [best],
  );

  return { best, submit };
}
