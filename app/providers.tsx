'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { MotionProvider } from '@/lib/motion/motion-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PageTransitionProvider } from '@/components/providers/PageTransition';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <MotionProvider>
      <ThemeProvider defaultTheme="light" storageKey="struq-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={700} skipDelayDuration={250}>
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </MotionProvider>
  );
}
