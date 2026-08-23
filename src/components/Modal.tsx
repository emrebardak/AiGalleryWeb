import { useEffect, useRef, useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '../types';

type ModalProps = {
  item: GalleryItem;
  onClose: () => void;
};

type DeleteStatus = 'idle' | 'deleting' | 'deleted' | 'error';

export function Modal({ item, onClose }: ModalProps) {
  const [copied, setCopied] = useState(false);
  const [imageLanded, setImageLanded] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<DeleteStatus>('idle');
  const [deleteError, setDeleteError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; leave the icon unchanged, no error UI per spec
    }
  }

  async function handleDelete() {
    if (deleteStatus === 'deleting') return;
    if (!window.confirm('Delete this card?')) return;

    setDeleteStatus('deleting');
    setDeleteError('');

    try {
      const response = await fetch('/api/delete-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null);
        const message =
          typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string'
            ? data.error
            : `Request failed (${response.status})`;
        throw new Error(message);
      }

      setDeleteStatus('deleted');
      setTimeout(onClose, 800);
    } catch (error) {
      setDeleteStatus('error');
      setDeleteError(error instanceof Error ? error.message : 'Something went wrong');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label="Gallery item detail"
        className="relative mx-4 max-w-2xl rounded-lg bg-zinc-950 p-6 focus:outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-4">
          <img src={item.beforeImage} alt="Before" className="aspect-square w-full rounded-lg object-cover" />
          <motion.img
            layoutId={`gallery-image-${item.id}`}
            onLayoutAnimationComplete={() => setImageLanded(true)}
            src={item.afterImage}
            alt="After"
            className="aspect-square w-full rounded-lg object-cover"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLanded ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4 flex items-start justify-between gap-4"
        >
          <p className="text-sm text-zinc-50">{item.prompt}</p>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy prompt"
              className={`rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                copied ? 'text-blue-500' : 'text-zinc-50 hover:opacity-70'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteStatus === 'deleting'}
              aria-label="Delete card"
              className="rounded-full p-2 text-zinc-50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </motion.div>

        {deleteStatus === 'deleted' && <p className="mt-2 text-right text-xs text-blue-500">Deleted.</p>}
        {deleteStatus === 'error' && <p className="mt-2 text-right text-xs text-zinc-400">{deleteError}</p>}
      </motion.div>
    </motion.div>
  );
}
