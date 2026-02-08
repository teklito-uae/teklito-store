
'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ProductImageProps extends Omit<ImageProps, 'src'> {
    src?: string | null;
    alt: string;
}

export default function ProductImage({ src, alt, className, fill, width, height, ...props }: ProductImageProps) {
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState<string | null>(src || null);

    useEffect(() => {
        setImgSrc(src || null);
        setError(false);
    }, [src]);

    // If no source or error occurred, show placeholder
    if (!imgSrc || error) {
        return (
            <div
                className={`relative bg-zinc-50 flex items-center justify-center overflow-hidden ${className}`}
                style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
                {...props}
            >
                {/* Background Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none p-4">
                    <Image
                        src="/images/teklito-logo.webp"
                        alt="Teklito Watermark"
                        width={200}
                        height={200}
                        className="object-contain w-1/2 h-1/2 opacity-10 grayscale brightness-150 contrast-50"
                        priority
                    />
                </div>

                {/* Fallback Text */}
                <span className="text-zinc-300 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] z-10 select-none">
                </span>
            </div>
        );
    }

    return (
        <Image
            src={imgSrc}
            alt={alt}
            className={className}
            fill={fill}
            width={width}
            height={height}
            onError={() => setError(true)}
            {...props}
        />
    );
}
