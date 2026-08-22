import { useState } from 'react';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { galleryItems } from './data/gallery';

const categories = ['All', ...new Set(galleryItems.map((item) => item.category))];

function App() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <main>
      <Hero />
      <div id="gallery">
        <FilterBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      </div>
    </main>
  );
}

export default App;
