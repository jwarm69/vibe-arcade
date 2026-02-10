'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3, Euler } from 'three';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useProximity } from '@/hooks/useProximity';
import { useSfx } from '@/hooks/useSfx';
import { useArcadeStore } from '@/hooks/useArcadeStore';
import { touchState } from '@/lib/touchState';
import { PLAYER_SPEED, PLAYER_HEIGHT, FRICTION } from '@/lib/constants';
import type { GameEntry } from '@/types';
import type { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib';

const _velocity = new Vector3();
const _direction = new Vector3();
const _frontVector = new Vector3();
const _sideVector = new Vector3();
const _euler = new Euler(0, 0, 0, 'YXZ');

const TOUCH_LOOK_SENSITIVITY = 0.004;

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
  const mode = useArcadeStore((s) => s.mode);

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

  // Release pointer lock immediately when leaving ARCADE mode
  useEffect(() => {
    if (mode !== 'ARCADE') {
      controlsRef.current?.unlock();
      document.exitPointerLock?.();
    }
  }, [mode]);

  const handleLock = useCallback(() => {
    // Only allow locking in ARCADE mode
    const currentMode = useArcadeStore.getState().mode;
    if (currentMode !== 'ARCADE') {
      controlsRef.current?.unlock();
      return;
    }
    setLocked(true);
  }, []);

  const handleUnlock = useCallback(() => {
    setLocked(false);
    // If we're in PLAYING mode and lost lock (user pressed Esc), pause
    const currentMode = useArcadeStore.getState().mode;
    if (currentMode === 'PLAYING') {
      useArcadeStore.getState().pause();
    }
  }, []);

  useFrame((_, delta) => {
    const currentMode = useArcadeStore.getState().mode;
    if (currentMode !== 'ARCADE') return;

    // On desktop, require pointer lock; on mobile, always active
    if (!locked && !touchState.isMobile) return;

    // ── Touch look (mobile) ──
    if (touchState.isMobile) {
      _euler.setFromQuaternion(camera.quaternion);
      _euler.y -= touchState.lookDelta.x * TOUCH_LOOK_SENSITIVITY;
      _euler.x -= touchState.lookDelta.y * TOUCH_LOOK_SENSITIVITY;
      _euler.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, _euler.x));
      camera.quaternion.setFromEuler(_euler);
      touchState.lookDelta.x = 0;
      touchState.lookDelta.y = 0;
    }

    // ── Movement (keyboard + touch merged) ──
    const { forward, backward, left, right } = keys.current;

    _frontVector.set(0, 0, Number(backward) - Number(forward) + touchState.move.y);
    _sideVector.set(Number(left) - Number(right) - touchState.move.x, 0, 0);

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

  // Don't render PointerLockControls when not in ARCADE mode or on mobile
  if (mode !== 'ARCADE') return null;
  if (touchState.isMobile) return null;

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  );
}
