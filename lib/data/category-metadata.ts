export interface Subcategory {
    name: string;
    slug: string;
}

export interface Brand {
    name: string;
    logo?: string;
    icon?: string;
}

export const categoryMetadata: Record<string, { subcategories: Subcategory[], brands: Brand[] }> = {
    'mobiles': {
        subcategories: [
            { name: 'Mobile Covers', slug: 'mobile-covers' },
            { name: 'Charger', slug: 'charger' },
            { name: 'Screen Protectors', slug: 'screen-protectors' },
            { name: 'Smartwatches', slug: 'smartwatches' },
            { name: 'Power Banks', slug: 'power-banks' },
            { name: 'Headsets', slug: 'headsets' },
            { name: 'Cable', slug: 'cable' },
            { name: 'Wearable Accessories', slug: 'wearable-accessories' },
            { name: 'Memory Cards', slug: 'memory-cards' },
            { name: 'Car Holders', slug: 'car-holders' },
            { name: 'Mobile Photography', slug: 'mobile-photography' },
        ],
        brands: [
            { name: 'Apple', icon: 'Apple' },
            { name: 'Samsung', icon: 'Smartphone' },
            { name: 'Google', icon: 'Search' },
            { name: 'OnePlus', icon: 'PlusSquare' },
            { name: 'Xiaomi', icon: 'Cpu' },
            { name: 'Huawei', icon: 'Globe' },
            { name: 'Oppo', icon: 'Camera' },
            { name: 'Vivo', icon: 'Zap' },
        ]
    },
    'watches': {
        subcategories: [
            { name: 'Smartwatches', slug: 'smartwatches' },
            { name: 'Straps', slug: 'straps' },
            { name: 'Chargers', slug: 'chargers' },
            { name: 'Cases', slug: 'cases' },
        ],
        brands: [
            { name: 'Apple', icon: 'Watch' },
            { name: 'Samsung', icon: 'Circle' },
            { name: 'Garmin', icon: 'Navigation' },
            { name: 'Fitbit', icon: 'Activity' },
            { name: 'Huawei', icon: 'Shield' },
            { name: 'Amazfit', icon: 'Moon' },
        ]
    },
    'laptops': {
        subcategories: [
            { name: 'Gaming Laptops', slug: 'gaming-laptops' },
            { name: 'Ultrabooks', slug: 'ultrabooks' },
            { name: '2-in-1 Laptops', slug: '2-in-1' },
            { name: 'Business Laptops', slug: 'business' },
        ],
        brands: [
            { name: 'Apple', icon: 'Laptop' },
            { name: 'Dell', icon: 'Monitor' },
            { name: 'HP', icon: 'HardDrive' },
            { name: 'Lenovo', icon: 'Tablet' },
            { name: 'Asus', icon: 'Cpu' },
            { name: 'Acer', icon: 'Layers' },
            { name: 'MSI', icon: 'Dribbble' },
        ]
    }
};
