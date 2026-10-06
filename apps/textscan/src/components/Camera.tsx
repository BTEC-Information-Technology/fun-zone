import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onCapture: (dataUrl: string, crop: boolean) => void;
  onCancel: () => void;
}

type Caps = MediaTrackCapabilities & { torch?: boolean; zoom?: { min: number; max: number; step: number } };

export function Camera({ onCapture, onCancel }: Props) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [status, setStatus] = useState<'starting' | 'camera' | 'error'>('starting');
  const [err, setErr] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [zoomHw, setZoomHw] = useState<{ min: number; max: number } | null>(null);
  const [level, setLevel] = useState(1);

  const stop = () => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    trackRef.current = null;
  };

  const start = useCallback(async () => {
    setStatus('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // Request a high resolution — the default stream is small (preview), not good for OCR.
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 3840 },
          height: { ideal: 2160 },
        },
        audio: false,
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      trackRef.current = track;
      const caps = (track.getCapabilities?.() ?? {}) as Caps;
      setTorchSupported(!!caps.torch);
      setZoomHw(caps.zoom ? { min: caps.zoom.min, max: caps.zoom.max } : null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('camera');
    } catch (e) {
      const name = (e as DOMException)?.name;
      setErr(name === 'NotAllowedError' ? t('scan.denied') : t('scan.noCamera'));
      setStatus('error');
    }
  }, [t]);

  useEffect(() => {
    void start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTorch = async () => {
    const track = trackRef.current;
    if (!track) return;
    const next = !torchOn;
    try {
      await track.applyConstraints({ advanced: [{ torch: next }] } as unknown as MediaTrackConstraints);
      setTorchOn(next);
    } catch {
      /* unsupported */
    }
  };

  const digitalScale = (lvl: number) => 1 + (lvl - 1) * 0.5; // 1, 1.5, 2, 2.5, 3

  const applyZoom = async (lvl: number) => {
    const track = trackRef.current;
    if (track && zoomHw) {
      const z = zoomHw.min + ((zoomHw.max - zoomHw.min) * (lvl - 1)) / 4;
      try {
        await track.applyConstraints({ advanced: [{ zoom: z }] } as unknown as MediaTrackConstraints);
      } catch {
        /* ignore */
      }
    } else if (videoRef.current) {
      videoRef.current.style.transform = `scale(${digitalScale(lvl)})`;
    }
  };

  const cycleZoom = () => {
    const next = (level % 5) + 1;
    setLevel(next);
    void applyZoom(next);
  };

  const capture = (crop: boolean) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;
    // Capture exactly the displayed video frame (WYSIWYG) — at the stream resolution.
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const digital = !zoomHw && level > 1 ? digitalScale(level) : 1;
    const sw = vw / digital;
    const sh = vh / digital;
    const sx = (vw - sw) / 2;
    const sy = (vh - sh) / 2;
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    canvas.getContext('2d')!.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/jpeg', 0.92);
    stop();
    onCapture(url, crop);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <video ref={videoRef} playsInline muted className="h-full w-full object-contain" />
      </div>

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-950 p-6 text-center text-neutral-200">
          <p>{err}</p>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-indigo-500 px-5 py-2.5 font-semibold text-white hover:bg-indigo-400"
          >
            {t('btn.cancel')}
          </button>
        </div>
      )}

      {status === 'camera' && (
        <>
          <p className="absolute left-0 right-0 top-6 text-center text-sm text-white/90">{t('scan.hint')}</p>

          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            aria-label={t('btn.cancel')}
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-xl text-white backdrop-blur"
          >
            ✕
          </button>

          {/* Flash */}
          {torchSupported && (
            <button
              type="button"
              onClick={toggleTorch}
              aria-label="flash"
              className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur ${
                torchOn ? 'bg-amber-400 text-neutral-900' : 'bg-black/60 text-white'
              }`}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 2v11h3v9l7-12h-4l3-8z" />
              </svg>
            </button>
          )}

          {/* Zoom */}
          <button
            type="button"
            onClick={cycleZoom}
            aria-label="zoom"
            className="absolute bottom-12 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-sm font-semibold text-white backdrop-blur"
          >
            {level}×
          </button>

          {/* Whole photo (no cropping) */}
          <button
            type="button"
            onClick={() => capture(false)}
            className="absolute bottom-[38px] left-5 rounded-full bg-black/60 px-5 py-2 text-sm font-medium text-white backdrop-blur"
          >
            {t('crop.whole')}
          </button>

          {/* Capture + crop (default) */}
          <button
            type="button"
            onClick={() => capture(true)}
            aria-label="capture"
            className="absolute bottom-10 left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 items-center justify-center rounded-full border-4 border-white/80 bg-white/30 backdrop-blur active:scale-95"
          >
            <span className="h-14 w-14 rounded-full bg-white" />
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
