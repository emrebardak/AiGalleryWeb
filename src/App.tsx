import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { GalleryGrid } from './components/GalleryGrid';
import { Modal } from './components/Modal';
import { Footer } from './components/Footer';
import { AddCardPage } from './components/AddCardPage';
import { galleryItems } from './data/gallery';
import type { GalleryItem } from './types';

const categories = ['All', ...new Set(galleryItems.map((item) => item.category))];
const addCardCategories = categories.filter((category) => category !== 'All');

function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash.replace('#', ''));

  useEffect(() => {
    function handleHashChange() {
      setHash(window.location.hash.replace('#', ''));
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const hash = useHash();

  if (hash === 'add-card') {
    return <AddCardPage categories={addCardCategories} />;
  }

  return (
    <main>
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
