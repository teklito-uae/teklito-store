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
import { cn } from '@/lib/utils';

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
        <Button variant="ghost" size="sm" className="gap-1.5 font-bold text-[11px] uppercase tracking-wider hover:bg-transparent">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-[10px] font-black text-black">{user.name?.[0]?.toUpperCase()}</span>
          </div>
          <span className="hidden lg:inline max-w-[80px] truncate">{user.name}</span>
          <ChevronDown className="h-3 w-3 text-zinc-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl border-zinc-100 shadow-xl shadow-black/5">
        <div className="px-3 py-2 border-b border-zinc-100">
          <p className="text-[11px] font-black uppercase tracking-widest text-black truncate">{user.name}</p>
          <p className="text-[10px] text-zinc-400 font-medium truncate">{user.email}</p>
        </div>
        <DropdownMenuItem asChild>
          <Link to="/orders" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider cursor-pointer">
            <Package className="h-4 w-4" /> My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-100" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-red-500 cursor-pointer focus:text-red-500"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
