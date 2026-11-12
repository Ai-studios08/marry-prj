import { useState } from 'react';
import { Landmark } from 'lucide-react';
import type { MediaAsset } from '../data/media';

interface MediaImageProps {
  asset: MediaAsset;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function MediaImage({
  asset,
  className = '',
  priority = false,
  sizes,
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={asset.alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0F2A43] via-[#1B3A57] to-[#2B4C6B] text-[#FAF7F2] p-6 text-center ${className}`}
      >
        <Landmark className="h-8 w-8 text-[#C8963E] mb-2" aria-hidden="true" />
        <span className="text-xs tracking-wide opacity-85 max-w-[24ch]">{asset.alt}</span>
      </div>
    );
  }

  return (
    <img
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
