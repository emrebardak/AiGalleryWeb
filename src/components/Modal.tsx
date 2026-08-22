import { useEffect, useRef, useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '../types';

type ModalProps = {
  item: GalleryItem;
  onClose: () => void;
};

export function Modal({ item, onClose }: ModalProps) {
  const [copied, setCopied] = useState(false);
  const [imageLanded, setImageLanded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label="Gallery item detail"
        className="relative mx-4 max-w-2xl rounded-lg bg-zinc-50 p-6 dark:bg-zinc-950"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-zinc-950 transition-opacity hover:opacity-70 dark:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <X size={20} />
        </button>

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
          <p className="text-sm text-zinc-950 dark:text-zinc-50">{item.prompt}</p>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy prompt"
            className={`shrink-0 rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              copied ? 'text-blue-500' : 'text-zinc-950 hover:opacity-70 dark:text-zinc-50'
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
