'use client';

import { Canvas } from '@react-three/fiber';
import { ArcadeScene } from './ArcadeScene';
import { HudOverlay } from '@/components/hud/HudOverlay';
import { GameOverlay } from '@/components/overlay/GameOverlay';
import { PauseMenu } from '@/components/overlay/PauseMenu';
import type { GameEntry } from '@/types';

interface ArcadeCanvasProps {
  games: GameEntry[];
}

export function ArcadeCanvas({ games }: ArcadeCanvasProps) {
  return (
    <div className="relative h-screen w-screen">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 70, near: 0.1, far: 100 }}
        style={{ background: '#000a00' }}
      >
        <ArcadeScene games={games} />
      </Canvas>

      <HudOverlay />
      <GameOverlay />
      <PauseMenu />
    </div>
  );
}
