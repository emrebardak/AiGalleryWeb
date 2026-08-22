import type { GalleryItem } from '../types';
import { GalleryCard } from './GalleryCard';

type GalleryGridProps = {
  items: GalleryItem[];
  activeCategory: string;
  onSelect: (item: GalleryItem) => void;
};

export function GalleryGrid({ items, activeCategory, onSelect }: GalleryGridProps) {
  const visibleItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="grid grid-cols-2 gap-4 px-4 pb-16 md:grid-cols-3 lg:grid-cols-4">
      {visibleItems.map((item) => (
        <div key={item.id} className="animate-in fade-in duration-300">
          <GalleryCard item={item} onClick={() => onSelect(item)} />
        </div>
      ))}
    </div>
  );
}
