'use client';

import { useState, useCallback } from 'react';
import { useArcadeStore } from '@/hooks/useArcadeStore';
import { EmbedFallback } from './EmbedFallback';

export function GameOverlay() {
  const mode = useArcadeStore((s) => s.mode);
  const activeGame = useArcadeStore((s) => s.activeGame);
  const [iframeError, setIframeError] = useState(false);

  const handleIframeError = useCallback(() => {
    setIframeError(true);
  }, []);

  // Reset error state when game changes
  const prevSlug = activeGame?.slug;
  if (!prevSlug) {
    if (iframeError) setIframeError(false);
  }

  if (mode !== 'PLAYING' && mode !== 'PAUSED') return null;
  if (!activeGame) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Escape hint bar */}
      <div className="absolute left-0 right-0 top-0 z-50 bg-black/60 px-4 py-1 text-center">
        <span className="text-xs text-green-400/60">
          Press{' '}
          <kbd className="rounded border border-green-400/30 px-1 font-mono text-xs">
            Esc
          </kbd>{' '}
          to pause
        </span>
      </div>

      {iframeError ? (
        <EmbedFallback url={activeGame.embedUrl} title={activeGame.title} />
      ) : (
        <iframe
          src={activeGame.embedUrl}
          title={activeGame.title}
          className="h-full w-full border-0"
          allow="fullscreen; gamepad; autoplay"
          sandbox="allow-scripts allow-same-origin allow-popups"
          onError={handleIframeError}
        />
      )}
    </div>
  );
}
