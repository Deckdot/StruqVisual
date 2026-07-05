'use client';
/* eslint-disable @next/next/no-img-element -- brand favicons are external dynamic URLs, not next/image-optimizable */

// components/dashboard/canon/tabs/brands-tab.tsx
// Curated brand design directions. Ported from DesignOS BrandsTab (visual layer):
// a card per brand with its signature accent and a favicon mark.

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight } from 'lucide-react';
import { CANON_BRANDS } from '@/lib/canon/brands';

function domainFor(id: string) {
  // Best-effort favicon domain from the brand id.
  const map: Record<string, string> = {
    'bmw-m': 'bmw.com',
    bmw: 'bmw.com',
    linear: 'linear.app',
    'linear.app': 'linear.app',
  };
  return map[id] ?? `${id}.com`;
}

export function BrandsTab() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CANON_BRANDS;
    return CANON_BRANDS.filter(
      (b) => b.name.toLowerCase().includes(q) || b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto w-full max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-meta-text" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek een merkrichting..."
            className="h-13 w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-primary-text shadow-sm focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((brand) => (
          <motion.a
            key={brand.id}
            href={`https://${domainFor(brand.id)}`}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* accent band */}
            <div className="relative h-20" style={{ background: brand.accent }}>
              <div className="absolute -bottom-5 left-5 flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${domainFor(brand.id)}&sz=64`}
                  alt={brand.name}
                  className="h-5 w-5 object-contain"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 px-5 pb-5 pt-7">
              <div className="flex items-center justify-between">
                <h3 className="text-[1rem] font-medium text-primary-text transition-colors group-hover:text-accent">
                  {brand.name}
                </h3>
                <ArrowUpRight className="h-4 w-4 text-meta-text transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {brand.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-panel px-2.5 py-0.5 text-[0.68rem] font-medium uppercase tracking-wide text-meta-text"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
