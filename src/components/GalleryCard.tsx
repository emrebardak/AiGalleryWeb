import { motion } from 'framer-motion';
import type { GalleryItem } from '../types';

type GalleryCardProps = {
  item: GalleryItem;
  onClick: () => void;
};

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`View ${item.category} example`}
      whileHover={{ scale: 1.1, zIndex: 20 }}
      whileFocus={{ scale: 1.1, zIndex: 20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative block w-full overflow-hidden rounded-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <motion.img
        layoutId={`gallery-image-${item.id}`}
        src={item.afterImage}
        alt=""
        className="block h-auto w-full rounded-lg"
      />
    </motion.button>
  );
}
