/**
 * Returns the first valid image URL from an array, or a placeholder.
 */
export function getImageUrl(images: string[] | undefined, fallback = 'https://placehold.co/600x600/f4f4f5/9090b0?text=No+Image'): string {
  if (!images || images.length === 0) return fallback;
  return images[0] || fallback;
}
