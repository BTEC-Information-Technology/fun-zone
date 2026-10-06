export type ProgressCb = (progress: number, status: string) => void;

/** Cleans the OCR text: excess spaces/blank lines. */
export function cleanText(text: string): string {
  return text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Recognizes text from an image (Tesseract.js, ron+eng). Reports real progress. */
export async function recognize(dataUrl: string, onProgress?: ProgressCb): Promise<string> {
  const { createWorker, PSM } = await import('tesseract.js');
  const worker = await createWorker('ron+eng', 1, {
    logger: (m: { status?: string; progress?: number }) => {
      if (typeof m.progress === 'number' && m.status) onProgress?.(m.progress, m.status);
    },
  });
  await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO });
  const { data } = await worker.recognize(dataUrl);
  await worker.terminate();
  return cleanText(data.text);
}
