'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    ShoppingBag,
    Heart,
    MapPin,
    User,
    LogOut,
    ChevronRight,
    ShieldCheck,
    CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const profileMenuItems = [
    { id: 'orders', label: 'Recent Orders', desc: 'Track, return or buy again', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { id: 'favourites', label: 'Favourites', desc: 'See your saved tech gear', icon: Heart, color: 'bg-rose-50 text-rose-600' },
    { id: 'addresses', label: 'My Addresses', desc: 'Manage delivery locations', icon: MapPin, color: 'bg-amber-50 text-amber-600' },
    { id: 'account', label: 'My Account', desc: 'Edit profile and security', icon: User, color: 'bg-purple-50 text-purple-600' },
    { id: 'payments', label: 'Payment Options', desc: 'Manage your cards and wallet', icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'security', label: 'Security Protocols', desc: 'Passwords and authentication', icon: ShieldCheck, color: 'bg-zinc-100 text-zinc-900' },
];

export default function ProfilePage() {
    const router = useRouter();
    // Simulate logged in user
    const [user] = useState({
        name: 'Ismail',
        email: 'ismail.teklito@example.com',
        avatar: '/images/user-avatar/1.svg'
    });

    const handleLogout = () => {
        router.push('/');
    };

    return (
        <div className="bg-zinc-50/30 min-h-screen pb-20">
            {/* Elite Profile Hero */}
            <div className="bg-[#D4FF00] py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        <div className="relative h-28 w-28 md:h-40 md:w-40 rounded-full bg-white p-1 shadow-2xl shadow-black/10">
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                fill
                                className="object-cover rounded-full"
                                priority
                            />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black font-poppins">
                                Hello, {user.name}
                            </h1>
                            <p className="text-lg md:text-2xl font-bold text-black/70 font-poppins">
                                How is the day
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Action Grid */}
            <div className="container mx-auto px-4 md:px-8 -mt-8 md:-mt-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {profileMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => router.push(`/${item.id}`)}
                                className="group bg-white p-6 rounded-[2rem] border border-zinc-100/80 shadow-sm hover:shadow-xl hover:shadow-black/5 hover:border-black transition-all duration-500 text-left flex items-start gap-4"
                            >
                                <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500", item.color)}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h3 className="text-[13px] font-black uppercase tracking-widest text-black font-poppins">
                                        {item.label}
                                    </h3>
                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight font-poppins">
                                        {item.desc}
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                            </button>
                        );
                    })}
                </div>

                {/* Account Settings / Footer */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-zinc-900 rounded-[2.5rem] text-white">
                    <div className="space-y-1 text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Auth</p>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Manage your encryption settings</h2>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary transition-colors active:scale-95"
                    >
                        <LogOut className="h-4 w-4" />
                        Log Out of System
                    </button>
                </div>
            </div>
        </div>
    );
}
