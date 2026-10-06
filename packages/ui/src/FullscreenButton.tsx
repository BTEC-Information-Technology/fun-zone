import { useFullscreen } from './useFullscreen';

interface Props {
  labelEnter: string;
  labelExit: string;
  className?: string;
}

/** Shared fullscreen button. Hidden on platforms without support (e.g. iOS Safari). */
export function FullscreenButton({ labelEnter, labelExit, className }: Props) {
  const { isFullscreen, supported, toggle } = useFullscreen();
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFullscreen ? labelExit : labelEnter}
      className={className ?? 'rounded-md p-2 text-neutral-200 transition-colors hover:bg-white/10'}
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        {isFullscreen ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        )}
      </svg>
    </button>
  );
}
