import type { ComponentProps } from 'react';
import { pictureSources } from '../assets';

/**
 * A photo served as AVIF or WebP at a size suited to the screen, falling back to the original JPEG.
 * `sizes` tells the browser how wide the photo is shown, so phones never download the desktop size.
 */
export function Picture({ src, sizes = '100vw', ...img }: ComponentProps<'img'> & { src: string; sizes?: string }) {
  const sources = pictureSources(src);
  if (!sources) return <img src={src} decoding="async" {...img} />;
  return (
    <picture>
      <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
      {sources.webp && <source type="image/webp" srcSet={sources.webp} sizes={sizes} />}
      <img src={src} decoding="async" {...img} />
    </picture>
  );
}
