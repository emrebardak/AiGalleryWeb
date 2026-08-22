import type { GalleryItem } from '../types';

export const galleryItems: GalleryItem[] = [
  {
    id: 'modern-1',
    category: 'Modern',
    beforeImage: '/images/before/modern-1.svg',
    afterImage: '/images/after/modern-1.jpg',
    prompt: 'A row of trees along a lakeside park path, golden hour sun breaking through the leaves, cyclists resting on the grass',
  },
  {
    id: 'fantasy-1',
    category: 'Fantasy',
    beforeImage: '/images/before/fantasy-1.svg',
    afterImage: '/images/after/fantasy-1.jpg',
    prompt: 'A dusk seascape, deep orange horizon fading into blue, two silhouettes sitting on a rocky shoreline overlooking the water',
  },
  {
    id: 'concept-1',
    category: 'Concept',
    beforeImage: '/images/before/concept-1.svg',
    afterImage: '/images/after/concept-1.jpg',
    prompt: 'A cloud-shaped archway bench cut into a park billboard, warm evening light, two people walking through with a scooter',
  },
];
