
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

    // If neither fill nor width is provided, we default to fill=true to avoid next/image errors
    const isFill = fill === undefined && width === undefined ? true : fill;

    useEffect(() => {
        setImgSrc(src || null);
        setError(false);
    }, [src]);

    // If no source or error occurred, show placeholder
    if (!imgSrc || error) {
        return (
            <div
                className={`relative bg-zinc-50 flex items-center justify-center overflow-hidden ${className}`}
                style={{ width: isFill ? '100%' : width, height: isFill ? '100%' : height }}
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
            fill={isFill}
            width={isFill ? undefined : (width || 300)}
            height={isFill ? undefined : (height || 300)}
            onError={() => setError(true)}
            {...props}
        />
    );
}
