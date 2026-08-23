import { useState } from 'react';

type AddCardPageProps = {
  categories: string[];
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function AddCardPage({ categories }: AddCardPageProps) {
  const [category, setCategory] = useState(categories[0] ?? '');
  const [afterImage, setAfterImage] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const canSubmit = category.trim() !== '' && afterImage.trim() !== '' && prompt.trim() !== '';

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
          category,
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

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-6 px-6 py-16">
      <h1 className="font-hero text-3xl text-zinc-50">Add a card</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm text-zinc-300">
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)} className={inputClasses}>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-300">
          After image URL
          <input
            type="url"
            required
            value={afterImage}
            onChange={(event) => setAfterImage(event.target.value)}
            placeholder="https://..."
            className={inputClasses}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-300">
          Before image URL (optional)
          <input
            type="url"
            value={beforeImage}
            onChange={(event) => setBeforeImage(event.target.value)}
            placeholder="https://..."
            className={inputClasses}
          />
        </label>

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
