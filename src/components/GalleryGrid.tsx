import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { GalleryItem } from '../types';
import { GalleryCard } from './GalleryCard';

gsap.registerPlugin(ScrollTrigger);

type GalleryGridProps = {
  items: GalleryItem[];
  activeCategory: string;
  onSelect: (item: GalleryItem, imgEl: HTMLImageElement) => void;
};

export function GalleryGrid({ items, activeCategory, onSelect }: GalleryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const visibleItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  useGSAP(
    () => {
      const cards = gridRef.current?.querySelectorAll('.gallery-card-cell');
      if (!cards || cards.length === 0) return;

      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        ease: 'power2.out',
        stagger: { each: 0.08, from: 'start' },
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: gridRef, dependencies: [activeCategory], revertOnUpdate: true }
  );

  return (
    <div ref={gridRef} className="columns-2 gap-4 px-4 pb-16 md:columns-3 lg:columns-4">
      {visibleItems.map((item) => (
        <div key={item.id} className="gallery-card-cell mb-4 break-inside-avoid">
          <GalleryCard item={item} onClick={(imgEl) => onSelect(item, imgEl)} />
        </div>
      ))}
    </div>
  );
}
