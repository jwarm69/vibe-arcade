'use client';

import { Suspense } from 'react';
import { CabinetScreen } from './CabinetScreen';
import { CabinetLabel } from './CabinetLabel';
import {
  CABINET_HEIGHT,
  CABINET_DEPTH,
  SCREEN_Y_OFFSET,
  SCREEN_Z_OFFSET,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  MARQUEE_TILT,
  CONTROL_PANEL_TILT,
  TMOLD_THICKNESS,
} from '@/lib/constants';
import type { GameEntry } from '@/types';

interface CabinetProps {
  game: GameEntry;
  isFocused: boolean;
}

/* ── Inline sub-components ───────────────────────────── */

function CabinetBody({ isFocused }: { isFocused: boolean }) {
  const bodyColor = isFocused ? '#0a2a0a' : '#0a1a0a';
  const emissive = isFocused ? '#002200' : '#000000';
  const ei = isFocused ? 0.15 : 0;

  return (
    <>
      {/* Kick plate / base */}
      <mesh position={[0, -0.725, 0]} castShadow>
        <boxGeometry args={[0.84, 0.35, 0.64]} />
        <meshStandardMaterial color={bodyColor} emissive={emissive} emissiveIntensity={ei} roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Coin door */}
      <mesh position={[0, -0.72, 0.33]}>
        <boxGeometry args={[0.25, 0.15, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Coin slot */}
      <mesh position={[0, -0.68, 0.335]}>
        <boxGeometry args={[0.10, 0.01, 0.025]} />
        <meshStandardMaterial color="#050505" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Lower body */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[0.8, 0.40, 0.6]} />
        <meshStandardMaterial color={bodyColor} emissive={emissive} emissiveIntensity={ei} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Upper body (transition between screen and marquee) */}
      <mesh position={[0, 0.61, 0]} castShadow>
        <boxGeometry args={[0.8, 0.08, 0.6]} />
        <meshStandardMaterial color={bodyColor} emissive={emissive} emissiveIntensity={ei} roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Top cap / crown */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.84, 0.04, 0.64]} />
        <meshStandardMaterial color={bodyColor} emissive={emissive} emissiveIntensity={ei} roughness={0.6} metalness={0.3} />
      </mesh>
    </>
  );
}

function CabinetControlPanel({ isFocused }: { isFocused: boolean }) {
  const bodyColor = isFocused ? '#0a2a0a' : '#0a1a0a';

  return (
    <>
      {/* Angled control panel shelf */}
      <mesh position={[0, 0.07, 0.12]} rotation={[CONTROL_PANEL_TILT, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.04, 0.35]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Left button (red) */}
      <mesh position={[-0.08, 0.10, 0.22]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color="#cc0000"
          emissive="#cc0000"
          emissiveIntensity={isFocused ? 0.4 : 0.1}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Right button (green) */}
      <mesh position={[0.08, 0.10, 0.22]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color="#00cc00"
          emissive="#00cc00"
          emissiveIntensity={isFocused ? 0.4 : 0.1}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Joystick */}
      <mesh position={[0, 0.12, 0.20]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 12]} />
        <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.7} />
      </mesh>
    </>
  );
}

function CabinetBezel() {
  const bezelColor = '#080808';
  const bezelDepth = 0.06;
  const bezelThickness = 0.03;

  const screenCenterY = SCREEN_Y_OFFSET;
  const screenCenterZ = SCREEN_Z_OFFSET;
  const halfW = SCREEN_WIDTH / 2;
  const halfH = SCREEN_HEIGHT / 2;

  return (
    <>
      {/* Top bezel strip */}
      <mesh position={[0, screenCenterY + halfH + bezelThickness / 2, screenCenterZ]}>
        <boxGeometry args={[SCREEN_WIDTH + bezelThickness * 2, bezelThickness, bezelDepth]} />
        <meshStandardMaterial color={bezelColor} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Bottom bezel strip */}
      <mesh position={[0, screenCenterY - halfH - bezelThickness / 2, screenCenterZ]}>
        <boxGeometry args={[SCREEN_WIDTH + bezelThickness * 2, bezelThickness, bezelDepth]} />
        <meshStandardMaterial color={bezelColor} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Left bezel strip */}
      <mesh position={[-halfW - bezelThickness / 2, screenCenterY, screenCenterZ]}>
        <boxGeometry args={[bezelThickness, SCREEN_HEIGHT, bezelDepth]} />
        <meshStandardMaterial color={bezelColor} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Right bezel strip */}
      <mesh position={[halfW + bezelThickness / 2, screenCenterY, screenCenterZ]}>
        <boxGeometry args={[bezelThickness, SCREEN_HEIGHT, bezelDepth]} />
        <meshStandardMaterial color={bezelColor} roughness={0.8} metalness={0.2} />
      </mesh>
    </>
  );
}

function CabinetMarquee({ title, isFocused }: { title: string; isFocused: boolean }) {
  return (
    <group position={[0, 0.78, 0]} rotation={[MARQUEE_TILT, 0, 0]}>
      {/* Marquee panel */}
      <mesh>
        <boxGeometry args={[0.8, 0.22, 0.08]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#00ff41"
          emissiveIntensity={isFocused ? 0.5 : 0.15}
          roughness={0.4}
          metalness={0.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CabinetTMolding({ isFocused }: { isFocused: boolean }) {
  const t = TMOLD_THICKNESS;
  const intensity = isFocused ? 1.2 : 0.3;
  const mat = (
    <meshStandardMaterial
      color="#00ff41"
      emissive="#00ff41"
      emissiveIntensity={intensity}
      toneMapped={false}
    />
  );

  const halfW = 0.4; // half cabinet width
  const halfD = 0.3; // half cabinet depth

  // Vertical edge strips along front corners, from kick plate top to top cap
  const vHeight = 1.57; // from -0.55 to +0.86 approx
  const vCenterY = 0.155;

  // Horizontal bezel edge strips
  const screenCenterY = SCREEN_Y_OFFSET;
  const screenCenterZ = SCREEN_Z_OFFSET;
  const bezelHalfH = SCREEN_HEIGHT / 2 + 0.03;
  const bezelHalfW = SCREEN_WIDTH / 2 + 0.03;

  return (
    <>
      {/* Front-left vertical */}
      <mesh position={[-halfW + t / 2, vCenterY, halfD - t / 2]}>
        <boxGeometry args={[t, vHeight, t]} />
        {mat}
      </mesh>

      {/* Front-right vertical */}
      <mesh position={[halfW - t / 2, vCenterY, halfD - t / 2]}>
        <boxGeometry args={[t, vHeight, t]} />
        {mat}
      </mesh>

      {/* Back-left vertical */}
      <mesh position={[-halfW + t / 2, vCenterY, -halfD + t / 2]}>
        <boxGeometry args={[t, vHeight, t]} />
        {mat}
      </mesh>

      {/* Back-right vertical */}
      <mesh position={[halfW - t / 2, vCenterY, -halfD + t / 2]}>
        <boxGeometry args={[t, vHeight, t]} />
        {mat}
      </mesh>

      {/* Top horizontal bezel edge */}
      <mesh position={[0, screenCenterY + bezelHalfH, screenCenterZ + 0.035]}>
        <boxGeometry args={[SCREEN_WIDTH + 0.08, t, t]} />
        {mat}
      </mesh>

      {/* Bottom horizontal bezel edge */}
      <mesh position={[0, screenCenterY - bezelHalfH, screenCenterZ + 0.035]}>
        <boxGeometry args={[SCREEN_WIDTH + 0.08, t, t]} />
        {mat}
      </mesh>
    </>
  );
}

/* ── Main Cabinet ────────────────────────────────────── */

export function Cabinet({ game, isFocused }: CabinetProps) {
  const [x, y, z] = game.cabinet.position;

  return (
    <group position={[x, y + CABINET_HEIGHT / 2, z]} rotation={[0, game.cabinet.rotationY, 0]}>
      <CabinetBody isFocused={isFocused} />
      <CabinetControlPanel isFocused={isFocused} />
      <CabinetBezel />
      <CabinetMarquee title={game.title} isFocused={isFocused} />
      <CabinetTMolding isFocused={isFocused} />

      {/* Screen */}
      <Suspense fallback={null}>
        <CabinetScreen thumbnail={game.thumbnail} isFocused={isFocused} />
      </Suspense>

      {/* Label */}
      <CabinetLabel title={game.title} author={game.author} visible={isFocused} />

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
