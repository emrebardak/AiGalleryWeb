import { describe, expect, it } from 'vitest';
import { appendGalleryItem } from './addCard';

const existing = JSON.stringify([
  {
    id: 'nature-1',
    category: 'Nature',
    beforeImage: '/images/before/placeholder.svg',
    afterImage: '/images/after/nature-1.jpg',
    prompt: 'existing item',
  },
]);

describe('appendGalleryItem', () => {
  it('appends a new item with a generated id, preserving existing items', () => {
    const result = JSON.parse(
      appendGalleryItem(
        existing,
        { category: 'Urban', afterImage: 'https://example.com/after.jpg', prompt: 'a new prompt' },
        1700000000000
      )
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(JSON.parse(existing)[0]);
    expect(result[1]).toEqual({
      id: 'urban-1700000000000',
      category: 'Urban',
      beforeImage: '/images/before/placeholder.svg',
      afterImage: 'https://example.com/after.jpg',
      prompt: 'a new prompt',
    });
  });

  it('uses the given beforeImage when provided instead of the placeholder', () => {
    const result = JSON.parse(
      appendGalleryItem(
        existing,
        {
          category: 'Wildlife',
          afterImage: 'https://example.com/after.jpg',
          beforeImage: 'https://example.com/before.jpg',
          prompt: 'a new prompt',
        },
        1700000000000
      )
    );

    expect(result[1].beforeImage).toBe('https://example.com/before.jpg');
  });

  it('appends to an empty list', () => {
    const result = JSON.parse(
      appendGalleryItem('[]', { category: 'Coastal', afterImage: 'https://example.com/a.jpg', prompt: 'p' }, 1)
    );

    expect(result).toEqual([
      {
        id: 'coastal-1',
        category: 'Coastal',
        beforeImage: '/images/before/placeholder.svg',
        afterImage: 'https://example.com/a.jpg',
        prompt: 'p',
      },
    ]);
  });
});
