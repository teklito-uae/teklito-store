'use client';

import { Smartphone, Apple, Search, PlusSquare, Cpu, Globe, Camera, Zap, Watch, Circle, Navigation, Activity, Shield, Moon, Monitor, HardDrive, Tablet, Layers, Dribbble, Laptop } from 'lucide-react';

const iconMap = {
    Apple, Smartphone, Search, PlusSquare, Cpu, Globe, Camera, Zap, Watch, Circle, Navigation, Activity, Shield, Moon, Monitor, HardDrive, Tablet, Layers, Dribbble, Laptop
};

interface Brand {
    name: string;
    icon?: string;
}

interface BrandsDiscoveryGridProps {
    brands: Brand[];
}

export default function BrandsDiscoveryGrid({ brands }: BrandsDiscoveryGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand, idx) => {
                const Icon = brand.icon ? iconMap[brand.icon as keyof typeof iconMap] : Smartphone;
                return (
                    <div
                        key={idx}
                        className="bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 group hover:border-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                            <Icon className="h-6 w-6 text-black" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">
                            {brand.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
