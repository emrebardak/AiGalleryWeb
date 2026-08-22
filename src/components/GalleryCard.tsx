import type { GalleryItem } from '../types';

type GalleryCardProps = {
  item: GalleryItem;
  onClick: (imgEl: HTMLImageElement) => void;
};

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const img = event.currentTarget.querySelector('img');
    if (img) onClick(img);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`View ${item.category} example`}
      className="relative block w-full overflow-hidden rounded-lg transition-transform duration-200 hover:z-20 hover:scale-110 hover:shadow-2xl focus-visible:z-20 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <img src={item.afterImage} alt="" className="block h-auto w-full" />
    </button>
  );
}
