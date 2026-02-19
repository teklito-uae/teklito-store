'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductImage from '@/components/product/ProductImage';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getWishlist } from '@/lib/store/wishlist';
import { removeFromWishlist } from '@/lib/store/wishlist';
import { addToCart } from '@/lib/store/cart';
import { getProductById } from '@/lib/actions/products';
import { getImageUrl } from '@/lib/utils/image';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

export default function WishlistPage() {
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

    useEffect(() => {
        loadWishlist();

        const handleWishlistUpdate = () => {
            loadWishlist();
        };

        window.addEventListener('wishlist-updated', handleWishlistUpdate);
        return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    }, []);

    const loadWishlist = async () => {
        const wishlist = getWishlist();
        const productsPromises = wishlist.productIds.map((id) => getProductById(id));
        const products = (await Promise.all(productsPromises)).filter(
            (p): p is Product => p !== null
        );
        setWishlistProducts(products);
    };

    const handleRemove = (productId: string) => {
        removeFromWishlist(productId);
        toast.info('Removed from wishlist');
    };

    const handleAddToCart = (productId: string, productName: string) => {
        addToCart(productId, 1);
        toast.success('Added to cart!', {
            description: `${productName} has been added to your cart.`,
        });
    };

    if (wishlistProducts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground mb-6">
                        Save your favorite products to your wishlist!
                    </p>
                    <Button asChild>
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">My Wishlist</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                        <Link href={`/products/${product.slug}`}>
                            <div className="relative aspect-square bg-muted">
                                <ProductImage
                                    src={getImageUrl(product.images, 0)}
                                    alt={product.name}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </Link>

                        <CardContent className="p-4">
                            <Link href={`/products/${product.slug}`}>
                                <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors mb-2">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className="flex-1"
                                    onClick={() => handleAddToCart(product.id, product.name)}
                                    disabled={!product.inStock}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemove(product.id)}
                                    className="text-destructive"
                                >
                                    <Heart className="h-4 w-4 fill-current" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
