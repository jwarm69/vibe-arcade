'use client';

import { Crosshair } from './Crosshair';
import { InteractionPrompt } from './InteractionPrompt';
import { MobileControls } from './MobileControls';
import { useArcadeStore } from '@/hooks/useArcadeStore';
import { useIsMobile } from '@/hooks/useIsMobile';

export function HudOverlay() {
  const mode = useArcadeStore((s) => s.mode);
  const isMobile = useIsMobile();

  if (mode !== 'ARCADE') return null;

  return (
    <>
      {!isMobile && <Crosshair />}
      {!isMobile && <InteractionPrompt />}

      {isMobile && <MobileControls />}

      {/* Scanline overlay */}
      <div className="scanlines pointer-events-none fixed inset-0" />

      {/* Desktop hint */}
      {!isMobile && (
        <div className="pointer-events-none fixed bottom-8 left-0 right-0 text-center">
          <span className="text-xs text-green-400/40">
            Click to look around &middot; WASD to move
          </span>
        </div>
      )}
    </>
  );
}
