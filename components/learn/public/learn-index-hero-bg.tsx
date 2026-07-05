'use client';

import Image from 'next/image';
import { useTheme } from '@/components/theme-provider';
import { useEffect, useState } from 'react';

export function LearnIndexHeroBg() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Avoid flash: render nothing until theme is known
  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Image
        src={isDark ? '/1200x630notext.png' : '/1200x630notextwhite.png'}
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* Gradient: fade into canvas colour at bottom so cards sit naturally */}
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/80" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-white/60" />
        </>
      )}
    </div>
  );
}
