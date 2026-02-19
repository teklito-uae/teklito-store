'use client';

import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrdersPage() {
    // TODO: Replace with actual API call to /api/orders
    const orders: any[] = [];

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
                    <p className="text-muted-foreground mb-6">
                        Start shopping to see your orders here!
                    </p>
                    <Button asChild>
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">My Orders</h1>
            {/* Order list will be implemented here */}
        </div>
    );
}
