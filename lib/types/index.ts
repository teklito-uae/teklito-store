// Product Types
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    images: string[];
    category: string;
    categorySlug: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    stock: number;
    variants?: ProductVariant[];
    tags: string[];
    createdAt: string;
}

export interface ProductVariant {
    type: 'size' | 'color' | 'storage' | 'model';
    name: string;
    options: VariantOption[];
}

export interface VariantOption {
    id: string;
    value: string;
    label: string;
    inStock: boolean;
    priceModifier?: number;
}

// Category Types
export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    icon?: string;
    productCount: number;
    description?: string;
}

// Cart Types
export interface CartItem {
    productId: string;
    quantity: number;
    selectedVariants?: Record<string, string>;
}

export interface Cart {
    items: CartItem[];
    updatedAt: string;
}

export interface CartItemWithProduct extends CartItem {
    product: Product;
}

// Wishlist Types
export interface Wishlist {
    productIds: string[];
    updatedAt: string;
}

// Review Types
export interface Review {
    id: string;
    productId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
    images?: string[];
}

// Order Types
export interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    shippingAddress: Address;
    paymentMethod: 'cod' | 'card' | 'upi';
}

export interface OrderItem {
    productId: string;
    productName: string;
    productSlug: string;
    quantity: number;
    price: number;
    image: string;
    selectedVariants?: Record<string, string>;
}

export interface Address {
    id?: string;
    fullName: string;
    phone: string;
    email?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
}

// User Types
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    addresses: Address[];
    createdAt: string;
}

// Auth Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Filter Types
export interface ProductFilters {
    category?: string;
    priceRange?: [number, number];
    rating?: number;
    inStock?: boolean;
    search?: string;
    tags?: string[];
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';

// Pagination Types
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
