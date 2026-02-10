'use client';

import { Suspense } from 'react';
import { CabinetScreen } from './CabinetScreen';
import { CabinetLabel } from './CabinetLabel';
import {
  CABINET_WIDTH,
  CABINET_HEIGHT,
  CABINET_DEPTH,
} from '@/lib/constants';
import type { GameEntry } from '@/types';

interface CabinetProps {
  game: GameEntry;
  isFocused: boolean;
}

export function Cabinet({ game, isFocused }: CabinetProps) {
  const [x, y, z] = game.cabinet.position;
  const bodyColor = isFocused ? '#0a2a0a' : '#0a1a0a';
  const emissive = isFocused ? '#00ff41' : '#000000';
  const emissiveIntensity = isFocused ? 0.3 : 0;

  return (
    <group position={[x, y + CABINET_HEIGHT / 2, z]} rotation={[0, game.cabinet.rotationY, 0]}>
      {/* Main cabinet body */}
      <mesh castShadow>
        <boxGeometry args={[CABINET_WIDTH, CABINET_HEIGHT, CABINET_DEPTH]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Screen */}
      <Suspense fallback={null}>
        <CabinetScreen
          thumbnail={game.thumbnail}
          isFocused={isFocused}
        />
      </Suspense>

      {/* Label */}
      <CabinetLabel
        title={game.title}
        author={game.author}
        visible={isFocused}
      />

      {/* Ambient glow light per cabinet */}
      <pointLight
        position={[0, 0, CABINET_DEPTH / 2 + 0.5]}
        color="#00ff41"
        intensity={isFocused ? 2 : 0.5}
        distance={3}
        decay={2}
      />
    </group>
  );
}
