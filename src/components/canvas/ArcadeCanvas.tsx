'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArcadeScene } from './ArcadeScene';
import { HudOverlay } from '@/components/hud/HudOverlay';
import { GameOverlay } from '@/components/overlay/GameOverlay';
import { PauseMenu } from '@/components/overlay/PauseMenu';
import { useArcadeStore } from '@/hooks/useArcadeStore';
import { buildArcadeLayout } from '@/lib/arcadeLayout';
import type { GameEntry } from '@/types';

interface ArcadeCanvasProps {
  games: GameEntry[];
}

export function ArcadeCanvas({ games }: ArcadeCanvasProps) {
  const mode = useArcadeStore((s) => s.mode);
  const isPlaying = mode === 'PLAYING' || mode === 'PAUSED';
  const layout = useMemo(() => buildArcadeLayout(games), [games]);

  return (
    <div className="relative h-screen w-screen">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 70, near: 0.1, far: 100 }}
        style={{
          background: '#000a00',
          pointerEvents: isPlaying ? 'none' : 'auto',
        }}
      >
        <ArcadeScene games={layout.games} bounds={layout.bounds} />
      </Canvas>

      <HudOverlay />
      <GameOverlay />
      <PauseMenu />
    </div>
  );
}
