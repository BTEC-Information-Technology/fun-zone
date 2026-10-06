function p2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Stopwatch: `m:ss.cc` or `h:mm:ss.cc` (cc = centiseconds). */
export function formatStopwatch(ms: number): string {
  const v = Math.max(0, Math.floor(ms));
  const cs = Math.floor((v % 1000) / 10);
  const totalSec = Math.floor(v / 1000);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600);
  if (h > 0) return `${h}:${p2(m)}:${p2(s)}.${p2(cs)}`;
  return `${m}:${p2(s)}.${p2(cs)}`;
}

/** Timer (countdown): `mm:ss` or `h:mm:ss`. Rounds the second up. */
export function formatTimer(ms: number): string {
  const totalSec = Math.ceil(Math.max(0, ms) / 1000);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600);
  if (h > 0) return `${h}:${p2(m)}:${p2(s)}`;
  return `${p2(m)}:${p2(s)}`;
}

/** Differences between consecutive laps: lap[i] = laps[i] - laps[i-1]. */
export function lapDeltas(laps: number[]): number[] {
  return laps.map((t, i) => (i === 0 ? t : t - laps[i - 1]));
}

/** Builds a duration from hours/minutes/seconds, in milliseconds. */
export function toMs(h: number, m: number, s: number): number {
  return ((h * 60 + m) * 60 + s) * 1000;
}
