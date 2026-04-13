import { Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/auth';
import { User, Package, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Avatar from 'boring-avatars';

export default function UserDropdown() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <Button variant="ghost" size="sm" className="gap-1 font-bold text-[11px] uppercase tracking-wider text-zinc-600 hover:text-black hover:bg-transparent" asChild>
        <Link to="/login">
          <User className="h-4 w-4" />
          <span className="hidden lg:inline">Sign In</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 cursor-pointer select-none group px-1">
          <div className="h-9 w-9 rounded-full overflow-hidden shrink-0 transition-transform group-hover:scale-105">
            <Avatar
              size={36}
              name={user.avatar || user.name}
              variant="pixel"
              colors={["#0a0310","#49007e","#ff005b","#ff7d10","#ffb238"]}
            />
          </div>
          <div className="hidden lg:block">
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-900 group-hover:text-primary transition-colors leading-none mb-0.5">
              {user.name}
            </p>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
              Account
            </p>
          </div>
          <ChevronDown className="h-3 w-3 text-zinc-400 transition-transform group-hover:translate-y-0.5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-zinc-100 shadow-2xl p-2">
        <div className="px-3 py-3 mb-2 bg-zinc-50 rounded-xl">
          <p className="text-[11px] font-black uppercase tracking-widest text-black mb-0.5 truncate">{user.name}</p>
          <p className="text-[10px] text-zinc-400 font-medium truncate">{user.email}</p>
        </div>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer p-2.5 rounded-lg focus:bg-zinc-50 transition-colors">
            <User className="h-4 w-4" /> My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer p-2.5 rounded-lg focus:bg-zinc-50 transition-colors">
            <Package className="h-4 w-4" /> My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-100 my-2" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-red-500 cursor-pointer p-2.5 rounded-lg focus:bg-red-50 focus:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
