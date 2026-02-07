import { Review } from '../types';

// TODO: Replace with API call to /api/reviews
// Expected endpoint: GET /api/reviews?productId=pc-001
// Expected response: { reviews: Review[], average: number, total: number }

export const reviews: Review[] = [
    // iPhone 15 Pro Case Reviews
    {
        id: 'r-001',
        productId: 'pc-001',
        userName: 'Sarah M.',
        userAvatar: '/images/avatars/user-1.jpg',
        rating: 5,
        comment: 'Absolutely love this case! The leather quality is exceptional and it feels premium. MagSafe works perfectly.',
        date: '2024-01-28T14:30:00Z',
        helpful: 45,
    },
    {
        id: 'r-002',
        productId: 'pc-001',
        userName: 'Michael R.',
        rating: 4,
        comment: 'Great case, but the brown color is slightly darker than shown in photos. Still very happy with the purchase.',
        date: '2024-01-25T10:15:00Z',
        helpful: 23,
    },

    // Apple Watch Series 9 Reviews
    {
        id: 'r-003',
        productId: 'w-001',
        userName: 'Jennifer L.',
        rating: 5,
        comment: 'Best smartwatch I\'ve ever owned. The health tracking features are incredibly accurate. Battery lasts 2 days easily.',
        date: '2024-01-26T16:45:00Z',
        helpful: 89,
    },
    {
        id: 'r-004',
        productId: 'w-001',
        userName: 'David K.',
        rating: 5,
        comment: 'Upgraded from Series 7. The brighter display and faster processor make a noticeable difference. Highly recommend!',
        date: '2024-01-24T09:20:00Z',
        helpful: 67,
    },

    // iPhone 15 Pro Max Reviews
    {
        id: 'r-005',
        productId: 'm-001',
        userName: 'Alex T.',
        rating: 5,
        comment: 'The titanium build feels incredibly premium. Camera is outstanding, especially the 5x zoom. Worth every penny!',
        date: '2024-01-29T11:30:00Z',
        helpful: 156,
    },
    {
        id: 'r-006',
        productId: 'm-001',
        userName: 'Emily W.',
        rating: 4,
        comment: 'Amazing phone but quite expensive. The Action button is a nice addition. Battery life is excellent.',
        date: '2024-01-27T15:10:00Z',
        helpful: 92,
    },
];

export function getReviewsByProductId(productId: string): Review[] {
    return reviews.filter((r) => r.productId === productId);
}

export function getAverageRating(productId: string): number {
    const productReviews = getReviewsByProductId(productId);
    if (productReviews.length === 0) return 0;

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / productReviews.length).toFixed(1));
}
