import { motion } from 'framer-motion';
import type { GalleryItem } from '../types';
import { GalleryCard } from './GalleryCard';

type GalleryGridProps = {
  items: GalleryItem[];
  activeCategory: string;
  onSelect: (item: GalleryItem) => void;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function GalleryGrid({ items, activeCategory, onSelect }: GalleryGridProps) {
  const visibleItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <motion.div
      key={activeCategory}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto columns-2 gap-4 px-6 pb-16 sm:px-10 md:columns-3 lg:columns-4 lg:px-16 xl:px-24"
    >
      {visibleItems.map((item) => (
        <motion.div key={item.id} variants={cardVariants} className="mb-4 break-inside-avoid">
          <GalleryCard item={item} onClick={() => onSelect(item)} />
        </motion.div>
      ))}
    </motion.div>
  );
}
