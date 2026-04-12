import { cn } from '@/lib/utils';

interface AppImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  src?: string;
}

const FALLBACK = 'https://placehold.co/600x600/f4f4f5/9090b0?text=No+Image';

export function AppImage({ src, alt = '', fill, className, ...props }: AppImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK;
  };

  if (fill) {
    return (
      <img
        src={src || FALLBACK}
        alt={alt}
        className={cn('absolute inset-0 w-full h-full object-cover', className)}
        loading="lazy"
        onError={handleError}
        {...props}
      />
    );
  }

  return (
    <img
      src={src || FALLBACK}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...props}
    />
  );
}

export default AppImage;
