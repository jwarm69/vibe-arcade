'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useProximity } from '@/hooks/useProximity';
import { useSfx } from '@/hooks/useSfx';
import { useArcadeStore } from '@/hooks/useArcadeStore';
import { PLAYER_SPEED, PLAYER_HEIGHT, FRICTION } from '@/lib/constants';
import type { GameEntry } from '@/types';
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';

const _velocity = new Vector3();
const _direction = new Vector3();
const _frontVector = new Vector3();
const _sideVector = new Vector3();

interface PlayerControllerProps {
  games: GameEntry[];
}

export function PlayerController({ games }: PlayerControllerProps) {
  const keys = useKeyboard();
  const { camera } = useThree();
  const controlsRef = useRef<PointerLockControlsImpl>(null);
  const { playBloop, playStart } = useSfx();
  const { setSfxCallback } = useProximity(games);
  const [locked, setLocked] = useState(false);

  // Wire SFX
  useEffect(() => {
    setSfxCallback(playBloop);
  }, [setSfxCallback, playBloop]);

  // Play start SFX when entering PLAYING mode
  useEffect(() => {
    return useArcadeStore.subscribe((state, prev) => {
      if (state.mode === 'PLAYING' && prev.mode === 'ARCADE') {
        playStart();
      }
    });
  }, [playStart]);

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, PLAYER_HEIGHT, 5);
  }, [camera]);

  // Handle pointer lock based on mode
  useEffect(() => {
    return useArcadeStore.subscribe((state, prev) => {
      if (state.mode === 'PLAYING' && prev.mode === 'ARCADE') {
        // Release pointer lock when starting game
        controlsRef.current?.unlock();
      }
      if (state.mode === 'ARCADE' && prev.mode !== 'ARCADE') {
        // Re-acquire pointer lock when returning to arcade
        // Note: needs user gesture, so we set a flag
        setLocked(false);
      }
    });
  }, []);

  const handleLock = useCallback(() => setLocked(true), []);
  const handleUnlock = useCallback(() => {
    setLocked(false);
    // If we're in ARCADE mode and lost lock, that's fine
    // If we're in PLAYING mode and lost lock (user pressed Esc), pause
    const mode = useArcadeStore.getState().mode;
    if (mode === 'PLAYING') {
      useArcadeStore.getState().pause();
    }
  }, []);

  useFrame((_, delta) => {
    const mode = useArcadeStore.getState().mode;
    if (mode !== 'ARCADE') return;
    if (!locked) return;

    const { forward, backward, left, right } = keys.current;

    _frontVector.set(0, 0, Number(backward) - Number(forward));
    _sideVector.set(Number(left) - Number(right), 0, 0);

    _direction
      .subVectors(_frontVector, _sideVector)
      .normalize()
      .multiplyScalar(PLAYER_SPEED * delta)
      .applyEuler(camera.rotation);

    _velocity.add(_direction);
    _velocity.multiplyScalar(FRICTION);

    camera.position.add(_velocity);
    camera.position.y = PLAYER_HEIGHT;

    // Clamp to floor bounds
    camera.position.x = Math.max(-14, Math.min(14, camera.position.x));
    camera.position.z = Math.max(-14, Math.min(14, camera.position.z));
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  );
}
