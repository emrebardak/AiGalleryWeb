import type { GalleryItem } from '../types';

type GalleryCardProps = {
  item: GalleryItem;
  onClick: () => void;
};

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${item.category} example`}
      className="aspect-square overflow-hidden rounded-lg transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <img src={item.afterImage} alt="" className="h-full w-full object-cover" />
    </button>
  );
}
