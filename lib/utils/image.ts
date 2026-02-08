export const PLACEHOLDER_IMAGE = '/images/teklito-logo.webp';

export function getImageUrl(images: string[] | undefined | null, index: number = 0): string {
    if (!images || images.length === 0) {
        return PLACEHOLDER_IMAGE;
    }
    return images[index] || images[0] || PLACEHOLDER_IMAGE;
}

export function getAllImages(images: string[] | undefined | null): string[] {
    if (!images || images.length === 0) {
        return [PLACEHOLDER_IMAGE];
    }
    return images;
}
