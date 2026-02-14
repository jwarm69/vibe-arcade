'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useArcadeStore } from './useArcadeStore';
import { PROXIMITY_RADIUS, FACING_DOT_THRESHOLD } from '@/lib/constants';
import type { PlacedGameEntry } from '@/types';

const _tempDir = new Vector3();
const _tempForward = new Vector3();

export function useProximity(games: PlacedGameEntry[]) {
  const { camera } = useThree();
  const prevFocused = useRef<string | null>(null);
  const sfxCallback = useRef<(() => void) | null>(null);

  useFrame(() => {
    const store = useArcadeStore.getState();
    if (store.mode !== 'ARCADE') return;

    let closest: PlacedGameEntry | null = null;
    let closestDist = Infinity;

    // Camera forward on XZ plane
    camera.getWorldDirection(_tempForward);
    _tempForward.y = 0;
    _tempForward.normalize();

    for (const game of games) {
      const [gx, , gz] = game.cabinet.position;

      // Distance check (XZ plane)
      const dx = gx - camera.position.x;
      const dz = gz - camera.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > PROXIMITY_RADIUS) continue;

      // Facing check
      _tempDir.set(dx, 0, dz).normalize();
      const dot = _tempForward.dot(_tempDir);

      if (dot < FACING_DOT_THRESHOLD) continue;

      if (dist < closestDist) {
        closestDist = dist;
        closest = game;
      }
    }

    const newSlug = closest?.slug ?? null;
    if (newSlug !== prevFocused.current) {
      prevFocused.current = newSlug;
      store.setFocusedGame(closest);
      if (newSlug && sfxCallback.current) {
        sfxCallback.current();
      }
    }
  });

  return { setSfxCallback: (cb: () => void) => { sfxCallback.current = cb; } };
}
