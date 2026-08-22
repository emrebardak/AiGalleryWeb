export type GalleryItem = {
  id: string;
  category: string;
  beforeImage: string; // path under /public/images
  afterImage: string; // path under /public/images, shown on card
  prompt: string;
};
