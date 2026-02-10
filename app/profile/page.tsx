'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, MapPin, User, LogOut, ExternalLink, Calendar, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/shared/Loading';
import Avatar from "boring-avatars";
import { AVATAR_COLORS } from '@/lib/utils/avatars';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import ProductImage from '@/components/product/ProductImage';
import { getImageUrl } from '@/lib/utils/image';

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    selected_variants: any;
    products: {
        name: string;
        images: string[];
        price: number;
    };
}

interface Order {
    id: string;
    order_number: string;
    total: number;
    subtotal: number;
    shipping: number;
    status: string;
    created_at: string;
    payment_method: string;
    shipping_address: {
        fullName: string;
        address: string;
        city: string;
        phone: string;
    };
    order_items: OrderItem[];
}

interface Profile {
    full_name: string;
    phone: string;
    avatar_name?: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/auth/login');
                return;
            }

            setUser(session.user);

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileData) setProfile(profileData);

            // Fetch Orders with nested items and products
            const { data: ordersData } = await supabase
                .from('orders')
                .select('*, order_items(*, products(*))')
                .eq('profile_id', session.user.id)
                .order('created_at', { ascending: false });

            if (ordersData) setOrders(ordersData as any[]);

            setLoading(false);
        };

        loadProfile();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen bg-gray-50/30 font-poppins">
            <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-72 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden rounded-3xl">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="h-24 w-24 rounded-full flex items-center justify-center mx-auto ring-4 ring-white shadow-xl overflow-hidden">
                                <Avatar
                                    size={96}
                                    name={profile?.avatar_name || user?.email}
                                    variant="beam"
                                    colors={AVATAR_COLORS}
                                />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl text-black">
                                    {profile?.full_name || user.user_metadata?.full_name || 'Valued Customer'}
                                </h2>
                                <p className="text-sm text-zinc-500 font-medium">{user?.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden p-2 space-y-1">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-14 font-bold text-black bg-zinc-50 rounded-2xl" asChild>
                            <Link href="/profile">
                                <Package className="h-5 w-5 text-zinc-400" />
                                Orders History
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-14 font-bold text-zinc-500 hover:text-black hover:bg-zinc-50 rounded-2xl transition-all">
                            <MapPin className="h-5 w-5 text-zinc-300" />
                            Manage Addresses
                        </Button>
                        <div className="h-px bg-zinc-100 my-2 mx-4" />
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-14 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-5 w-5 opacity-70" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            Recent Orders
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
                            {orders.length} Total
                        </span>
                    </div>

                    {orders.length === 0 ? (
                        <Card className="border-dashed border-2 border-zinc-200 bg-white/50 rounded-3xl overflow-hidden">
                            <CardContent className="p-16 text-center space-y-6">
                                <div className="h-20 w-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                                    <Package className="h-10 w-10 text-zinc-300" />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-bold text-black">No orders placed yet.</p>
                                    <p className="text-sm text-zinc-500 max-w-[200px] mx-auto">Start exploring our collection and make your first purchase.</p>
                                </div>
                                <Button asChild className="rounded-2xl h-12 px-8 font-black uppercase tracking-wider bg-black text-primary hover:bg-zinc-900 shadow-lg shadow-black/10">
                                    <Link href="/products">Shop Products</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl bg-white group">
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-6">
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="font-mono font-black text-lg text-black bg-zinc-50 px-3 py-1 rounded-xl border border-zinc-100 group-hover:border-primary/30 transition-colors">
                                                        {order.order_number}
                                                    </span>
                                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-zinc-100 text-zinc-600'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-zinc-300" />
                                                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-zinc-300" />
                                                        {order.order_items?.length} Items
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="h-4 w-4 text-zinc-300" />
                                                        {order.payment_method.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-left sm:text-right space-y-1">
                                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Grand Total</p>
                                                <p className="font-black text-3xl text-black tracking-tighter">${order.total.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between">
                                            <div className="flex -space-x-3 overflow-hidden">
                                                {order.order_items?.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="relative h-10 w-10 rounded-full border-2 border-white bg-zinc-50 overflow-hidden shadow-sm">
                                                        <ProductImage
                                                            src={getImageUrl(item.products.images)}
                                                            alt={item.products.name}
                                                            className="h-full w-full object-cover"
                                                            fill
                                                        />
                                                    </div>
                                                ))}
                                                {order.order_items && order.order_items.length > 3 && (
                                                    <div className="h-10 w-10 rounded-full border-2 border-white bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                                                        +{order.order_items.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-11 px-6 rounded-2xl text-[11px] font-black uppercase tracking-wider border-2 hover:bg-black hover:text-primary transition-all group-hover:scale-105"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        Review Details
                                                        <ChevronRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden font-poppins">
                                                    <div className="bg-black p-8 text-white">
                                                        <DialogHeader className="mb-0">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Order Information</p>
                                                                    <DialogTitle className="text-3xl font-black tracking-tighter uppercase">{order.order_number}</DialogTitle>
                                                                </div>
                                                                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                                                                    <p className="text-[9px] font-black uppercase text-zinc-400">Status</p>
                                                                    <p className="text-xs font-bold text-white capitalize">{order.status}</p>
                                                                </div>
                                                            </div>
                                                        </DialogHeader>
                                                    </div>

                                                    <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                                                        {/* Items Section */}
                                                        <div>
                                                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 px-1">Order Items</h3>
                                                            <div className="space-y-4">
                                                                {order.order_items?.map((item, idx) => (
                                                                    <div key={idx} className="flex gap-4 items-center bg-zinc-50 p-4 rounded-3xl border border-zinc-100/50">
                                                                        <div className="relative h-16 w-16 rounded-2xl bg-white border border-zinc-100 flex-shrink-0 overflow-hidden p-1 flex items-center justify-center">
                                                                            <ProductImage
                                                                                src={getImageUrl(item.products.images)}
                                                                                alt={item.products.name}
                                                                                className="h-full w-full object-contain"
                                                                                fill
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1 flex flex-col min-w-0">
                                                                            <span className="text-xs font-black text-black leading-tight mb-1">
                                                                                {item.products.name}
                                                                            </span>
                                                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                                                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                        <span className="font-black text-black text-sm">
                                                                            ${(item.price * item.quantity).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Summary Grid */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {/* Shipping Address */}
                                                            <div className="bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <MapPin className="h-4 w-4 text-zinc-400" />
                                                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-black">Ship To</h3>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-xs font-bold text-black">{order.shipping_address?.fullName}</p>
                                                                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                                                                        {order.shipping_address?.address}, {order.shipping_address?.city}
                                                                    </p>
                                                                    <p className="text-[11px] text-zinc-500 font-bold mt-2">
                                                                        {order.shipping_address?.phone}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Payment Summary */}
                                                            <div className="bg-black text-white p-6 rounded-3xl shadow-xl">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <CreditCard className="h-4 w-4 text-primary" />
                                                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Summary</h3>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between text-[11px] font-medium text-zinc-400">
                                                                        <span>Subtotal</span>
                                                                        <span className="text-white font-bold">${order.subtotal.toFixed(2)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-[11px] font-medium text-zinc-400">
                                                                        <span>Shipping</span>
                                                                        <span className="text-white font-bold">{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                                                                    </div>
                                                                    <div className="h-px bg-zinc-800 my-2" />
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Total</span>
                                                                        <span className="text-2xl font-black tracking-tighter">${order.total.toFixed(2)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
