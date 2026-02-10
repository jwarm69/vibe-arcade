'use client';

import { useRef } from 'react';
import { touchState } from '@/lib/touchState';
import { useArcadeStore } from '@/hooks/useArcadeStore';

const JOYSTICK_SIZE = 130;
const KNOB_SIZE = 54;
const MAX_DIST = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

export function MobileControls() {
  const mode = useArcadeStore((s) => s.mode);
  const focusedGame = useArcadeStore((s) => s.focusedGame);

  const knobRef = useRef<HTMLDivElement>(null);
  const joystickTouchId = useRef<number | null>(null);
  const joystickOrigin = useRef<{ x: number; y: number } | null>(null);
  const lookTouchId = useRef<number | null>(null);
  const lastLookPos = useRef<{ x: number; y: number } | null>(null);

  if (mode !== 'ARCADE') return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    const halfW = window.innerWidth / 2;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];

      if (t.clientX < halfW && joystickTouchId.current === null) {
        joystickTouchId.current = t.identifier;
        joystickOrigin.current = { x: t.clientX, y: t.clientY };
        if (knobRef.current) knobRef.current.style.transform = 'translate(0px,0px)';
      } else if (t.clientX >= halfW && lookTouchId.current === null) {
        lookTouchId.current = t.identifier;
        lastLookPos.current = { x: t.clientX, y: t.clientY };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];

      // Joystick
      if (t.identifier === joystickTouchId.current && joystickOrigin.current) {
        const dx = t.clientX - joystickOrigin.current.x;
        const dy = t.clientY - joystickOrigin.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const clamped = Math.min(dist, MAX_DIST);
        const angle = Math.atan2(dy, dx);
        const cx = Math.cos(angle) * clamped;
        const cy = Math.sin(angle) * clamped;

        touchState.move.x = cx / MAX_DIST;
        touchState.move.y = cy / MAX_DIST;

        if (knobRef.current) knobRef.current.style.transform = `translate(${cx}px,${cy}px)`;
      }

      // Look
      if (t.identifier === lookTouchId.current && lastLookPos.current) {
        touchState.lookDelta.x += t.clientX - lastLookPos.current.x;
        touchState.lookDelta.y += t.clientY - lastLookPos.current.y;
        lastLookPos.current = { x: t.clientX, y: t.clientY };
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];

      if (t.identifier === joystickTouchId.current) {
        joystickTouchId.current = null;
        joystickOrigin.current = null;
        touchState.move.x = 0;
        touchState.move.y = 0;
        if (knobRef.current) knobRef.current.style.transform = 'translate(0px,0px)';
      }

      if (t.identifier === lookTouchId.current) {
        lookTouchId.current = null;
        lastLookPos.current = null;
      }
    }
  };

  const handlePlay = () => {
    useArcadeStore.getState().startPlaying();
  };

  return (
    <div
      className="fixed inset-0 z-30"
      style={{ touchAction: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* ── Joystick (bottom-left) ── */}
      <div
        className="absolute"
        style={{
          bottom: 40,
          left: 30,
          width: JOYSTICK_SIZE,
          height: JOYSTICK_SIZE,
          borderRadius: '50%',
          background: 'rgba(0,255,65,0.08)',
          border: '2px solid rgba(0,255,65,0.25)',
        }}
      >
        <div
          ref={knobRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -KNOB_SIZE / 2,
            marginTop: -KNOB_SIZE / 2,
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: '50%',
            background: 'rgba(0,255,65,0.25)',
            border: '2px solid rgba(0,255,65,0.5)',
          }}
        />
      </div>

      {/* ── PLAY button (visible when near a cabinet) ── */}
      {focusedGame && (
        <button
          className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-xl bg-green-500 px-8 py-3 text-lg font-bold text-black shadow-lg shadow-green-500/30 active:bg-green-400"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          onClick={handlePlay}
        >
          PLAY {focusedGame.title}
        </button>
      )}

      {/* ── Look hint (bottom-right) ── */}
      <div className="pointer-events-none absolute bottom-12 right-6 text-xs text-green-400/40">
        Drag to look
      </div>
    </div>
  );
}
