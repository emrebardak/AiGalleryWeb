import { useState } from 'react';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { GalleryGrid } from './components/GalleryGrid';
import { galleryItems } from './data/gallery';
import type { GalleryItem } from './types';

const categories = ['All', ...new Set(galleryItems.map((item) => item.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <main>
      <Hero />
      <div id="gallery">
        <FilterBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        <GalleryGrid items={galleryItems} activeCategory={activeCategory} onSelect={setSelectedItem} />
      </div>
    </main>
  );
}

export default App;
