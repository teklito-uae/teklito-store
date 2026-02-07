import { Category } from '../types';

// TODO: Replace with API call to /api/categories
// Expected endpoint: GET /api/categories
// Expected response: { categories: Category[] }

export const categories: Category[] = [
    {
        id: '1',
        name: 'Mobiles',
        slug: 'mobiles',
        image: '/images/categories/iphone.webp',
        icon: 'Smartphone',
        productCount: 28,
        description: 'Latest smartphones and accessories',
    },
    {
        id: '9',
        name: 'Phone Cases',
        slug: 'phone-cases',
        image: '/images/categories/iphone-case.webp',
        icon: 'Smartphone',
        productCount: 45,
        description: 'Premium protection for your devices',
    },
    {
        id: '2',
        name: 'Laptops',
        slug: 'laptops',
        image: '',
        icon: 'Laptop',
        productCount: 15,
        description: 'High-performance laptops',
    },
    {
        id: '3',
        name: 'Tablets',
        slug: 'tablets',
        image: '',
        icon: 'Tablet',
        productCount: 12,
        description: 'Versatile tablets',
    },
    {
        id: '4',
        name: 'Audio',
        slug: 'audio',
        image: '',
        icon: 'Headphones',
        productCount: 40,
        description: 'Premium sound gear',
    },
    {
        id: '5',
        name: 'Watches',
        slug: 'watches',
        image: '',
        icon: 'Watch',
        productCount: 32,
        description: 'Elite smartwatches',
    },
    {
        id: '6',
        name: 'Consoles',
        slug: 'consoles',
        image: '',
        icon: 'Gamepad2',
        productCount: 18,
        description: 'Next-gen gaming hubs',
    },
    {
        id: '7',
        name: 'Accessories',
        slug: 'accessories',
        image: '',
        icon: 'Box',
        productCount: 54,
        description: 'Essential tech gear',
    },
    {
        id: '8',
        name: 'Desktop',
        slug: 'desktop',
        image: '',
        icon: 'Monitor',
        productCount: 10,
        description: 'Pro workstations',
    },
];

export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((cat) => cat.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
    return categories.find((cat) => cat.id === id);
}
