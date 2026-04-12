import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('min-h-[50vh] flex flex-col items-center justify-center gap-6 px-4 text-center', className)}>
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
          <Icon className="h-10 w-10 text-zinc-300" />
        </div>
        <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
      </div>
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-black mb-2">{title}</h2>
        <p className="text-sm text-zinc-400 font-medium max-w-xs">{description}</p>
      </div>
      {actionLabel && actionTo && (
        <Button asChild className="h-12 px-8 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-black transition-all">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
