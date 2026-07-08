'use client';

// components/dashboard/recept/mobile/picker-sheet.tsx
//
// The repo-mandated mobile bottom sheet (fixed bottom-0, rounded-t-2xl, drag handle,
// backdrop close, pb-safe). ~58% height so the top of the preview stays visible and
// reacts behind the sheet — that's the mobile love moment. Selection does NOT
// auto-close (people flick through options); backdrop/handle closes.

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export function PickerSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-label={title}
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[58vh] flex-col rounded-t-2xl border-t border-border bg-background shadow-2xl"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)' }}
          >
            <div className="flex shrink-0 flex-col items-center gap-2 px-4 pb-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="Sluiten"
                className="h-1.5 w-10 rounded-full bg-border transition hover:brightness-110"
              />
              <span className="text-[0.7rem] font-medium uppercase tracking-widest text-meta-text">{title}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
