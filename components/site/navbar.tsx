'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, X, Menu } from 'lucide-react';
import type { SiteTheme } from '@/components/site/site-shell';
import { TransitionLink } from '@/components/providers/PageTransition';
import { AnimatedMark } from '@/components/site/brand/animated-mark';
import { SlotText } from '@/components/site/slot-text';

const NAV_LINKS = [
  { href: '/galerij', label: 'Galerij' },
  { href: '/visueel', label: 'Wat je maakt' },
  { href: '/methode', label: 'De methode' },
  { href: '/learn', label: 'Learn' },
  { href: '/gids', label: 'Gidsen' },
  { href: '/#prijzen', label: 'Prijzen' },
];

interface SiteNavbarProps {
  theme: SiteTheme;
  onToggleTheme: () => void;
}

export function SiteNavbar({ theme, onToggleTheme }: SiteNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <div className="sq-container-wide">
          <div
            className="pointer-events-auto mt-4 flex items-center justify-between rounded-full border px-5 py-3 transition-all duration-300 md:px-7"
            style={{
              background: scrolled ? 'var(--sq-raised)' : 'transparent',
              borderColor: scrolled ? 'var(--sq-line)' : 'transparent',
              boxShadow: scrolled ? 'var(--sq-shadow-float)' : 'none',
            }}
          >
            <TransitionLink
              href="/"
              className="flex items-center gap-2.5 sq-display text-xl font-semibold tracking-tight"
              aria-label="Struq home"
            >
              <AnimatedMark size="navbar" alt="Struq" />
              <span>struq<span style={{ color: 'var(--sq-accent)' }}>.</span></span>
            </TransitionLink>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Hoofdmenu">
              {NAV_LINKS.map((link) => (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className="sq-link sq-link-nav text-[0.9375rem]"
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </TransitionLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'light' ? 'Donker thema' : 'Licht thema'}
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                style={{ borderColor: 'var(--sq-line-strong)' }}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <TransitionLink href="/auth" className="sq-btn sq-btn-primary hidden !px-6 !py-3 sm:inline-flex">
                <SlotText>Start gratis</SlotText>
              </TransitionLink>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Menu openen"
                className="flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
                style={{ borderColor: 'var(--sq-line-strong)' }}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: 'var(--sq-paper)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            data-lenis-prevent
          >
            <div className="sq-container-wide flex items-center justify-between py-7">
              <span className="flex items-center gap-2.5 sq-display text-xl font-semibold">
                <AnimatedMark size="navbar" alt="Struq" />
                <span>struq<span style={{ color: 'var(--sq-accent)' }}>.</span></span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Menu sluiten"
                className="flex h-11 w-11 items-center justify-center rounded-full border"
                style={{ borderColor: 'var(--sq-line-strong)' }}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="sq-container flex flex-1 flex-col justify-center gap-2" aria-label="Mobiel menu">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TransitionLink
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="sq-display block py-3 text-4xl font-medium"
                  >
                    {link.label}
                  </TransitionLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + NAV_LINKS.length * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="pt-8"
              >
                <TransitionLink href="/auth" className="sq-btn sq-btn-accent" onClick={() => setMenuOpen(false)}>
                  <SlotText>Start gratis</SlotText>
                </TransitionLink>
              </motion.div>
            </nav>

            <div className="sq-container pb-10">
              <p className="sq-faint">Gratis starten. Geen creditcard nodig.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
