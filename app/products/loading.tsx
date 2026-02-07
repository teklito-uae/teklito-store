import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="h-12 w-48 bg-muted rounded mb-8 animate-pulse" />
            <ProductGridSkeleton count={12} />
        </div>
    );
}
