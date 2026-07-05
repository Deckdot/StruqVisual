'use client';

import { useState, useRef, useEffect } from 'react';
import type { InteractiveHtmlScene } from '@/lib/learning/types';
import { cn } from '@/lib/utils';

interface InteractiveHtmlFrameProps {
  scene: InteractiveHtmlScene;
  className?: string;
}

export function InteractiveHtmlFrame({ scene, className }: InteractiveHtmlFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (!doc) {
        setError(true);
        return;
      }
      doc.open();
      doc.write(scene.htmlPayload);
      doc.close();
      setLoaded(true);
    } catch {
      setError(true);
    }
  }, [scene.htmlPayload]);

  if (error) {
    return (
      <div className={cn('rounded-2xl border border-border bg-panel p-6 text-center', className)}>
        <p className="text-secondary-text text-sm">{scene.fallbackText}</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border border-border bg-panel overflow-hidden', className)}>
      {scene.instructions && (
        <div className="px-5 py-3 border-b border-border bg-canvas">
          <p className="text-sm text-secondary-text">{scene.instructions}</p>
        </div>
      )}
      <div className={cn('relative', !loaded && 'min-h-[200px]')}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          title={scene.title}
          className="w-full min-h-[320px] block"
          sandbox="allow-scripts"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>
      {scene.sandboxNote && (
        <div className="px-5 py-2 border-t border-border">
          <p className="text-xs text-meta-text">{scene.sandboxNote}</p>
        </div>
      )}
    </div>
  );
}
