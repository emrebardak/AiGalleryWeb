import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

type AddCardPageProps = {
  categories: string[];
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';
type UploadStatus = 'idle' | 'uploading' | 'error';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Image too large (max 8MB)');
  }

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    const message =
      typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
        ? data.error
        : `Upload failed (${response.status})`;
    throw new Error(message);
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

export function AddCardPage({ categories }: AddCardPageProps) {
  const [category, setCategory] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [afterUploadStatus, setAfterUploadStatus] = useState<UploadStatus>('idle');
  const [afterUploadError, setAfterUploadError] = useState('');
  const [beforeUploadStatus, setBeforeUploadStatus] = useState<UploadStatus>('idle');
  const [beforeUploadError, setBeforeUploadError] = useState('');

  const afterFileInputRef = useRef<HTMLInputElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = afterImage.trim() !== '' && prompt.trim() !== '';

  async function handleAfterFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setAfterUploadStatus('uploading');
    setAfterUploadError('');
    try {
      const url = await uploadImage(file);
      setAfterImage(url);
      setAfterUploadStatus('idle');
    } catch (error) {
      setAfterUploadStatus('error');
      setAfterUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  async function handleBeforeFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBeforeUploadStatus('uploading');
    setBeforeUploadError('');
    try {
      const url = await uploadImage(file);
      setBeforeImage(url);
      setBeforeUploadStatus('idle');
    } catch (error) {
      setBeforeUploadStatus('error');
      setBeforeUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/add-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category.trim() === '' ? 'All' : category,
          afterImage,
          beforeImage: beforeImage.trim() === '' ? undefined : beforeImage,
          prompt,
        }),
      });

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null);
        const message =
          typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
            ? data.error
            : `Request failed (${response.status})`;
        throw new Error(message);
      }

      setStatus('success');
      setCategory('');
      setAfterImage('');
      setBeforeImage('');
      setPrompt('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  }

  const inputClasses =
    'rounded-lg bg-zinc-900 px-4 py-3 text-zinc-50 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';
  const urlInputClasses = `${inputClasses} flex-1`;
  const uploadButtonClasses =
    'shrink-0 rounded-lg bg-zinc-900 p-3 text-zinc-50 transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40';

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-6 px-6 py-16">
      <a
        href="#"
        className="self-start text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        ← Back to gallery
      </a>

      <h1 className="font-hero text-3xl text-zinc-50">Add a card</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm text-zinc-300">
          Category (optional)
          {categories.length > 0 ? (
            <select value={category} onChange={(event) => setCategory(event.target.value)} className={inputClasses}>
              <option value="">All (default)</option>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g. Nature (defaults to All)"
              className={inputClasses}
            />
          )}
        </label>

        <div className="flex flex-col gap-2 text-sm text-zinc-300">
          <span>After image URL</span>
          <div className="flex items-center gap-2">
            <input
              type="url"
              required
              value={afterImage}
              onChange={(event) => setAfterImage(event.target.value)}
              placeholder="https://... or upload"
              aria-label="After image URL"
              className={urlInputClasses}
            />
            <button
              type="button"
              onClick={() => afterFileInputRef.current?.click()}
              disabled={afterUploadStatus === 'uploading'}
              aria-label="Upload after image"
              className={uploadButtonClasses}
            >
              <Upload size={18} />
            </button>
            <input
              ref={afterFileInputRef}
              type="file"
              accept="image/*"
              tabIndex={-1}
              onChange={handleAfterFileChange}
              className="sr-only"
            />
          </div>
          {afterUploadStatus === 'uploading' && <p className="text-xs text-zinc-500">Uploading...</p>}
          {afterUploadStatus === 'error' && <p className="text-xs text-zinc-400">{afterUploadError}</p>}
        </div>

        <div className="flex flex-col gap-2 text-sm text-zinc-300">
          <span>Before image URL (optional)</span>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={beforeImage}
              onChange={(event) => setBeforeImage(event.target.value)}
              placeholder="https://... or upload"
              aria-label="Before image URL"
              className={urlInputClasses}
            />
            <button
              type="button"
              onClick={() => beforeFileInputRef.current?.click()}
              disabled={beforeUploadStatus === 'uploading'}
              aria-label="Upload before image"
              className={uploadButtonClasses}
            >
              <Upload size={18} />
            </button>
            <input
              ref={beforeFileInputRef}
              type="file"
              accept="image/*"
              tabIndex={-1}
              onChange={handleBeforeFileChange}
              className="sr-only"
            />
          </div>
          {beforeUploadStatus === 'uploading' && <p className="text-xs text-zinc-500">Uploading...</p>}
          {beforeUploadStatus === 'error' && <p className="text-xs text-zinc-400">{beforeUploadError}</p>}
        </div>

        <label className="flex flex-col gap-2 text-sm text-zinc-300">
          Prompt
          <textarea
            required
            rows={4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className={inputClasses}
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit || status === 'submitting'}
          className="rounded-full bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40"
        >
          {status === 'submitting' ? 'Adding...' : 'Add card'}
        </button>

        {status === 'success' && <p className="text-sm text-blue-500">Added. Live in a minute or two.</p>}
        {status === 'error' && <p className="text-sm text-zinc-400">{errorMessage}</p>}
      </form>
    </section>
  );
}
