import type { GalleryItem } from '../types';

export const galleryItems: GalleryItem[] = [
  {
    id: 'modern-1',
    category: 'Modern',
    beforeImage: '/images/before/modern-1.svg',
    afterImage: '/images/after/modern-1.svg',
    prompt: 'A minimalist modern living room, natural light, Scandinavian furniture, soft shadows',
  },
  {
    id: 'fantasy-1',
    category: 'Fantasy',
    beforeImage: '/images/before/fantasy-1.svg',
    afterImage: '/images/after/fantasy-1.svg',
    prompt: 'An ancient stone castle floating above the clouds, dragons circling the towers, golden hour light',
  },
  {
    id: 'concept-1',
    category: 'Concept',
    beforeImage: '/images/before/concept-1.svg',
    afterImage: '/images/after/concept-1.svg',
    prompt: 'A sleek electric concept car, chrome body, studio lighting, motion blur background',
  },
];
