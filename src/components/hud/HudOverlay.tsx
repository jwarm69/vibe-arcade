'use client';

import { Crosshair } from './Crosshair';
import { InteractionPrompt } from './InteractionPrompt';
import { useArcadeStore } from '@/hooks/useArcadeStore';

export function HudOverlay() {
  const mode = useArcadeStore((s) => s.mode);

  if (mode !== 'ARCADE') return null;

  return (
    <>
      <Crosshair />
      <InteractionPrompt />

      {/* Scanline overlay */}
      <div className="scanlines pointer-events-none fixed inset-0" />

      {/* Click to enter prompt (when pointer not locked) */}
      <div className="pointer-events-none fixed bottom-8 left-0 right-0 text-center">
        <span className="text-xs text-green-400/40">
          Click to look around &middot; WASD to move
        </span>
      </div>
    </>
  );
}
