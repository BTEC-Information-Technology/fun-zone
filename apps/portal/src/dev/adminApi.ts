export type DataFile = 'catalog' | 'categories' | 'tags';

/** Writes the data to src/data/<file>.json through the DEV endpoint (local admin). */
export async function saveData(file: DataFile, data: unknown): Promise<void> {
  const res = await fetch('/__admin/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file, data }),
  });
  if (!res.ok) {
    const info = await res.text().catch(() => '');
    throw new Error(`Save failed (${res.status}). ${info}`);
  }
}

/** Uploads a card image → public/images/apps/<id>.<ext>. Returns the path. */
export async function uploadImage(id: string, file: File): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(new Error('file read failed'));
    r.readAsDataURL(file);
  });
  const base64 = dataUrl.split(',')[1] ?? '';
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const res = await fetch('/__admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ext, data: base64 }),
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status}).`);
  const json = (await res.json()) as { path: string };
  return json.path;
}

