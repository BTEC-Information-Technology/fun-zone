import { type CSSProperties, type ReactNode } from 'react';

interface Props {
  /** Width/height ratio (1 = square, 21/27 ≈ 0.78 for Nibbles). */
  ratio?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Fixed-ratio box that switches its sizing logic by orientation, using CSS ONLY
 * (a single tree → the content does not remount on rotation):
 *  - PORTRAIT: width-driven (`w-full`), the height follows from the ratio.
 *  - LANDSCAPE: side = `min(width, height × ratio)` via container-query units,
 *    so the ratio is kept and it fills the available height.
 * The content must fill the box (`h-full w-full`).
 */
export function FitBox({ ratio = 1, className, children }: Props) {
  const style = { aspectRatio: ratio, '--r': String(ratio) } as CSSProperties;
  return (
    <div className="portrait:block landscape:flex landscape:min-h-0 landscape:flex-1 landscape:items-center landscape:justify-center landscape:[container-type:size]">
      <div
        className={`w-full landscape:w-[min(100cqw,calc(100cqh*var(--r)))] ${className ?? ''}`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
