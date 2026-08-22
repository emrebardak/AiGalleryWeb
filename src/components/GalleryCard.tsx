import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { GalleryItem } from '../types';

type GalleryCardProps = {
  item: GalleryItem;
  onClick: () => void;
};

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 20,
  });

  function handleMouseMove(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`View ${item.category} example`}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ scale: 1.1, zIndex: 20 }}
      whileFocus={{ scale: 1.1, zIndex: 20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="relative block w-full overflow-hidden rounded-lg shadow-lg hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
