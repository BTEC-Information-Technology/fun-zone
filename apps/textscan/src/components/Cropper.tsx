import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  src: string;
  onResult: (dataUrl: string) => void;
  onCancel: () => void;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function Cropper({ src, onResult, onCancel }: Props) {
  const { t } = useTranslation();
  const imgRef = useRef<HTMLImageElement>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);

  const local = (e: React.PointerEvent) => {
    const r = imgRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(r.width, e.clientX - r.left)),
      y: Math.max(0, Math.min(r.height, e.clientY - r.top)),
      w: r.width,
      h: r.height,
    };
  };

  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = local(e);
    startRef.current = { x: p.x, y: p.y };
    setRect({ x: p.x, y: p.y, w: 0, h: 0 });
  };
  const onMove = (e: React.PointerEvent) => {
    const s = startRef.current;
    if (!s) return;
    const p = local(e);
    setRect({
      x: Math.min(s.x, p.x),
      y: Math.min(s.y, p.y),
      w: Math.abs(p.x - s.x),
      h: Math.abs(p.y - s.y),
    });
  };
  const onUp = () => {
    startRef.current = null;
  };

  const recognize = () => {
    const img = imgRef.current!;
    const r = img.getBoundingClientRect();
    if (!rect || rect.w < 8 || rect.h < 8) {
      onResult(src); // no valid selection → use everything
      return;
    }
    const sx = img.naturalWidth / r.width;
    const sy = img.naturalHeight / r.height;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(rect.w * sx);
    canvas.height = Math.round(rect.h * sy);
    canvas
      .getContext('2d')!
      .drawImage(img, rect.x * sx, rect.y * sy, rect.w * sx, rect.h * sy, 0, 0, canvas.width, canvas.height);
    onResult(canvas.toDataURL('image/jpeg', 0.92));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <p className="py-2 text-center text-sm text-white/90">{t('crop.hint')}</p>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-2">
        <div className="relative">
          <img
            ref={imgRef}
            src={src}
            alt=""
            draggable={false}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            className="block max-h-[72vh] max-w-full touch-none select-none"
          />
          {rect && rect.w > 1 && rect.h > 1 && (
            <div
              className="pointer-events-none absolute border-2 border-indigo-400 bg-indigo-400/10"
              style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        <button type="button" onClick={onCancel} className="rounded-lg bg-neutral-800 py-2.5 text-sm text-neutral-200">
          {t('btn.cancel')}
        </button>
        <button
          type="button"
          onClick={() => onResult(src)}
          className="rounded-lg bg-neutral-700 py-2.5 text-sm text-neutral-100"
        >
          {t('crop.whole')}
        </button>
        <button
          type="button"
          onClick={recognize}
          className="rounded-lg bg-indigo-500 py-2.5 font-semibold text-white"
        >
          {t('crop.ok')}
        </button>
      </div>
    </div>
  );
}
