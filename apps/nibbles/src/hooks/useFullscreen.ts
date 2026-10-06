import { useCallback, useEffect, useState } from 'react';

interface FsDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => void;
}
interface FsElement extends HTMLElement {
  webkitRequestFullscreen?: () => void;
}

function fullscreenElement(): Element | null {
  const d = document as FsDocument;
  return document.fullscreenElement ?? d.webkitFullscreenElement ?? null;
}

function isSupported(): boolean {
  if (typeof document === 'undefined') return false;
  const el = document.documentElement as FsElement;
  return typeof el.requestFullscreen === 'function' || typeof el.webkitRequestFullscreen === 'function';
}

/** Fullscreen API with webkit fallback. On iOS Safari the API is missing → `supported` false. */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(() => fullscreenElement() !== null);
  const supported = isSupported();

  useEffect(() => {
    const handler = () => setIsFullscreen(fullscreenElement() !== null);
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  const toggle = useCallback(() => {
    if (fullscreenElement() !== null) {
      const d = document as FsDocument;
      if (document.exitFullscreen) void document.exitFullscreen();
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
    } else {
      const el = document.documentElement as FsElement;
      if (el.requestFullscreen) void el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
  }, []);

  return { isFullscreen, supported, toggle };
}
