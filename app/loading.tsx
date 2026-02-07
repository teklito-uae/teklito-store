import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <ProductGridSkeleton count={8} />
        </div>
    );
}
