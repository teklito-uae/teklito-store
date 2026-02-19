import { getCategories } from '@/lib/actions/categories';
import { Category } from '@/lib/types';
import CategoryGrid from '@/components/home/CategoryGrid';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
    Smartphone,
    Laptop,
    Tablet,
    Headphones,
    Gamepad2,
    Box,
    Monitor,
    LayoutGrid,
    Watch,
    Speaker,
    Zap,
    Cable,
    Camera,
    Wifi,
    HardDrive,
    Cpu,
    Briefcase,
    Code,
    Home
} from 'lucide-react';

const iconMap: Record<string, any> = {
    Smartphone,
    Laptop,
    Tablet,
    Headphones,
    Gamepad2,
    Box,
    Monitor,
    Watch,
    Speaker,
    Zap,
    Cable,
    Camera,
    Wifi,
    HardDrive,
    Cpu,
    Briefcase,
    Code,
    Home
};

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl font-black uppercase tracking-tight">All Categories</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((category: Category) => {
                    const Icon = iconMap[category.icon || 'Smartphone'] || Smartphone;
                    const hasImage = category.image && category.image !== '';

                    return (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="group flex flex-col items-center bg-zinc-50 rounded-[1.5rem] p-6 hover:bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-300 border border-zinc-100"
                        >
                            <div className={cn(
                                "relative w-16 h-16 md:w-20 md:h-20 mb-4 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                                hasImage ? "bg-white" : "bg-[#c7f502] text-black"
                            )}>
                                {hasImage ? (
                                    <Image
                                        src={category.image!}
                                        alt={category.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                ) : (
                                    <Icon strokeWidth={1.5} className="h-8 w-8 md:h-10 md:w-10" />
                                )}
                            </div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-center">{category.name}</h3>
                            <p className="text-[10px] text-zinc-500 mt-1 text-center line-clamp-2">{category.description}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
