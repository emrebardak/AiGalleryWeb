import type { GalleryItem } from '../src/types';

export type NewCardInput = {
  category: string;
  afterImage: string;
  beforeImage?: string;
  prompt: string;
};

const PLACEHOLDER_BEFORE_IMAGE = '/images/before/placeholder.svg';

export function appendGalleryItem(currentJson: string, input: NewCardInput, now: number = Date.now()): string {
  const items: GalleryItem[] = JSON.parse(currentJson);

  const newItem: GalleryItem = {
    id: `${input.category.toLowerCase()}-${now}`,
    category: input.category,
    beforeImage: input.beforeImage || PLACEHOLDER_BEFORE_IMAGE,
    afterImage: input.afterImage,
    prompt: input.prompt,
  };

  items.push(newItem);
  return JSON.stringify(items, null, 2);
}

export function removeGalleryItem(currentJson: string, id: string): string {
  const items: GalleryItem[] = JSON.parse(currentJson);
  const filtered = items.filter((item) => item.id !== id);
  return JSON.stringify(filtered, null, 2);
}
