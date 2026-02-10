'use client';

import { Suspense } from 'react';
import { Sparkles } from '@react-three/drei';
import { ArcadeFloor } from './ArcadeFloor';
import { Cabinet } from './Cabinet';
import { NeonSign } from './NeonSign';
import { PlayerController } from './PlayerController';
import { useArcadeStore } from '@/hooks/useArcadeStore';
import { FOG_COLOR, FOG_NEAR, FOG_FAR } from '@/lib/constants';
import type { GameEntry } from '@/types';

interface ArcadeSceneProps {
  games: GameEntry[];
}

export function ArcadeScene({ games }: ArcadeSceneProps) {
  const focusedGame = useArcadeStore((s) => s.focusedGame);

  return (
    <>
      <fog attach="fog" args={[FOG_COLOR, FOG_NEAR, FOG_FAR]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.3} color="#004400" />

      <ArcadeFloor />

      <Suspense fallback={null}>
        <NeonSign />
      </Suspense>

      {games.map((game) => (
        <Cabinet
          key={game.slug}
          game={game}
          isFocused={focusedGame?.slug === game.slug}
        />
      ))}

      <PlayerController games={games} />

      {/* Faint floating green motes */}
      <Sparkles
        count={40}
        scale={[20, 8, 20]}
        size={1.5}
        speed={0.2}
        opacity={0.15}
        color="#00ff41"
      />
    </>
  );
}
