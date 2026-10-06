import { useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@funzone/ui';
import { Camera } from './components/Camera';
import { Cropper } from './components/Cropper';
import { Editor } from './components/Editor';
import { recognize } from './lib/ocr';

type Screen = 'main' | 'camera' | 'crop' | 'processing' | 'editor';

function TextScan() {
  const { t } = useTranslation();
  const [screen, setScreen] = useState<Screen>('main');
  const [img, setImg] = useState('');
  const [text, setText] = useState('');
  const [progress, setProgress] = useState(0);
  const [cropFrom, setCropFrom] = useState<Screen>('main');
  const fileRef = useRef<HTMLInputElement>(null);

  const run = async (dataUrl: string) => {
    setProgress(0);
    setScreen('processing');
    try {
      const txt = await recognize(dataUrl, (p, status) => {
        setProgress(/recogn/i.test(status) ? 0.5 + 0.5 * p : 0.5 * p);
      });
      setText(txt);
    } catch (e) {
      setText(`[Error] ${(e as Error)?.message ?? String(e)}`);
    }
    setProgress(1);
    setScreen('editor');
  };

  const onCapture = (url: string, crop: boolean) => {
    setImg(url);
    if (crop) {
      setCropFrom('camera');
      setScreen('crop');
    } else {
      void run(url);
    }
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allows re-selecting the same image
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImg(String(reader.result));
      setCropFrom('main');
      setScreen('crop');
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 pt-10">
        <p className="text-center text-sm text-neutral-400">{t('main.hint')}</p>
        <button
          type="button"
          onClick={() => setScreen('camera')}
          className="w-full rounded-2xl bg-indigo-500 py-6 text-2xl font-semibold text-white transition-colors hover:bg-indigo-400"
        >
          {t('btn.start')}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-2xl bg-neutral-800 py-4 text-lg font-medium text-neutral-100 transition-colors hover:bg-neutral-700"
        >
          {t('btn.gallery')}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>

      {screen === 'camera' && <Camera onCapture={onCapture} onCancel={() => setScreen('main')} />}

      {screen === 'crop' && (
        <Cropper src={img} onResult={(url) => void run(url)} onCancel={() => setScreen(cropFrom)} />
      )}

      {screen === 'processing' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-8 text-neutral-200">
          <p>{t('scan.processing')}</p>
          <div className="w-full max-w-xs">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-400 transition-[width] duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-center text-sm text-neutral-400">{Math.round(progress * 100)}%</p>
          </div>
        </div>
      )}

      {screen === 'editor' && <Editor text={text} onChange={setText} onDone={() => setScreen('main')} />}
    </>
  );
}

export default function App() {
  const { t } = useTranslation();
  const help = { title: t('help.title'), items: t('help.items', { returnObjects: true }) as string[] };
  return (
    <AppShell appName="Text Recognition" accent="text-indigo-300" help={help}>
      <TextScan />
    </AppShell>
  );
}
