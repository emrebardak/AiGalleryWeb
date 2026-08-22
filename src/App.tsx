import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { GalleryGrid } from './components/GalleryGrid';
import { Modal } from './components/Modal';
import { ThemeToggle } from './components/ThemeToggle';
import { galleryItems } from './data/gallery';
import type { GalleryItem } from './types';

gsap.registerPlugin(Flip);

const categories = ['All', ...new Set(galleryItems.map((item) => item.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);

  function handleCardSelect(item: GalleryItem, imgEl: HTMLImageElement) {
    flipStateRef.current = Flip.getState(imgEl);
    setSelectedItem(item);
  }

  return (
    <main>
      <ThemeToggle />
      <Hero />
      <div id="gallery">
        <FilterBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        <GalleryGrid items={galleryItems} activeCategory={activeCategory} onSelect={handleCardSelect} />
      </div>
      {selectedItem && (
        <Modal item={selectedItem} onClose={() => setSelectedItem(null)} flipState={flipStateRef.current} />
      )}
    </main>
  );
}

export default App;
