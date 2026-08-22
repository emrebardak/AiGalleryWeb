import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { GalleryGrid } from './components/GalleryGrid';
import { Modal } from './components/Modal';
import { ThemeToggle } from './components/ThemeToggle';
import { Footer } from './components/Footer';
import { galleryItems } from './data/gallery';
import type { GalleryItem } from './types';

const categories = ['All', ...new Set(galleryItems.map((item) => item.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <main>
      <ThemeToggle />
      <Hero />
      <div id="gallery">
        <FilterBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        <GalleryGrid items={galleryItems} activeCategory={activeCategory} onSelect={setSelectedItem} />
      </div>
      <Footer />
      <AnimatePresence>
        {selectedItem && <Modal key={selectedItem.id} item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </main>
  );
}

export default App;
