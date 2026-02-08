'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, LogOut, Package, Heart, MapPin, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BoringAvatar from "boring-avatars";
import { AVATAR_COLORS } from '@/lib/utils/avatars';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UserDropdown({ user, profile }: { user: any, profile?: any }) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/');
    };

    if (!user) {
        return (
            <Button variant="ghost" size="icon" className="hidden lg:flex relative text-current h-10 w-10 hover:text-primary transition-colors" asChild>
                <Link href="/auth/login">
                    <User className="h-5 w-5" />
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="flex h-9 w-9 md:h-10 md:w-10 p-0 overflow-hidden rounded-full border border-zinc-200 hover:border-primary transition-all">
                    <BoringAvatar
                        size={40}
                        name={profile?.avatar_name || user.email}
                        variant="beam"
                        colors={AVATAR_COLORS}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 font-poppins bg-white border-zinc-100 text-black" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">
                            {profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Valued Customer'}
                        </p>
                        <p className="text-xs leading-none text-zinc-500 truncate">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-zinc-50">
                        <Link href="/profile">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-zinc-50">
                        <Link href="/profile?tab=orders">
                            <Package className="mr-2 h-4 w-4" />
                            <span>Orders</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-zinc-50">
                        <Link href="/wishlist">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Wishlist</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-zinc-50">
                        <Link href="/profile?tab=addresses">
                            <MapPin className="mr-2 h-4 w-4" />
                            <span>Addresses</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
