'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { DEMO_ASSETS } from '@/lib/vault/demo-assets';
import { TYPE_META } from '@/lib/vault/types';

/**
 * Global search in the app header (DesignOS pattern): a quiet pill that
 * expands on focus and shows live results; Enter opens the library filtered
 * on the query. ⌘K / Ctrl-K focuses it from anywhere.
 */
export function GlobalSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DEMO_ASSETS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some((tag) => tag.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query]);

  const goToLibrary = (q: string) => {
    setOpen(false);
    router.push(q ? `/vault?q=${encodeURIComponent(q)}` : '/vault');
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="group flex w-44 items-center gap-2.5 rounded-full border border-border bg-panel px-4 py-2 shadow-sm transition-all duration-300 focus-within:w-64 focus-within:border-ring focus-within:bg-background sm:w-56 sm:focus-within:w-80 lg:w-64 lg:focus-within:w-96">
        <Search className="h-4 w-4 shrink-0 text-meta-text transition-colors group-focus-within:text-primary-text" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') goToLibrary(query.trim());
          }}
          placeholder="Zoeken…"
          aria-label="Zoek in de bibliotheek"
          className="w-full bg-transparent text-sm text-primary-text placeholder:text-meta-text focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Zoekopdracht wissen"
            className="rounded-full p-0.5 text-meta-text transition-colors hover:text-primary-text"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-meta-text sm:block">
            ⌘K
          </kbd>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute right-0 top-full z-50 mt-2 w-full min-w-64 overflow-hidden rounded-xl border border-border bg-background shadow-md">
          {results.length > 0 ? (
            <ul>
              {results.map((asset) => (
                <li key={asset.id}>
                  <button
                    type="button"
                    onClick={() => goToLibrary(asset.name)}
                    className="flex w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-panel-hover"
                  >
                    <span className="truncate text-sm text-primary-text">{asset.name}</span>
                    <span className="shrink-0 text-[11px] uppercase tracking-wider text-meta-text">
                      {TYPE_META[asset.type].label}
                    </span>
                  </button>
                </li>
              ))}
              <li className="border-t border-border">
                <button
                  type="button"
                  onClick={() => goToLibrary(query.trim())}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-secondary-text transition-colors duration-150 hover:bg-panel-hover hover:text-primary-text"
                >
                  Alles voor &lsquo;{query.trim()}&rsquo; →
                </button>
              </li>
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-secondary-text">Niets gevonden voor &lsquo;{query.trim()}&rsquo;</p>
          )}
        </div>
      )}
    </div>
  );
}
