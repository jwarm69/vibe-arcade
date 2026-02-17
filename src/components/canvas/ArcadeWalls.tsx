'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ArcadeBounds } from '@/types';
import { AdditiveBlending, Color } from 'three';
import type { Material, Mesh, PointLight as PointLightType } from 'three';
import { WALL_HEIGHT } from '@/lib/constants';

interface ArcadeWallsProps {
  bounds: ArcadeBounds;
}

interface WallPanelProps {
  width: number;
  height: number;
  position: [number, number, number];
  rotationY: number;
  phase: number;
}

interface CornerColumnProps {
  position: [number, number, number];
  height: number;
  index: number;
}

function setMaterialOpacity(material: Material | Material[], opacity: number) {
  if (Array.isArray(material)) return;
  material.opacity = opacity;
}

/* ---------- Sweep bar config (3 tiers) ---------- */
const SWEEP_BARS = [
  // Tier 1: Original cyan
  { color: '#9fffff', scaleH: 0.35, speed: 0.35, maxOpacity: 0.80 },
  { color: '#9fffff', scaleH: 0.35, speed: 0.40, maxOpacity: 0.80 },
  { color: '#9fffff', scaleH: 0.35, speed: 0.46, maxOpacity: 0.80 },
  { color: '#9fffff', scaleH: 0.35, speed: 0.51, maxOpacity: 0.80 },
  // Tier 2: Cyan-green
  { color: '#00ffcc', scaleH: 0.20, speed: 0.45, maxOpacity: 0.55 },
  { color: '#00ffcc', scaleH: 0.20, speed: 0.49, maxOpacity: 0.55 },
  { color: '#00ffcc', scaleH: 0.20, speed: 0.53, maxOpacity: 0.55 },
  { color: '#00ffcc', scaleH: 0.20, speed: 0.57, maxOpacity: 0.55 },
  // Tier 3: Faint magenta
  { color: '#ff00ff', scaleH: 0.12, speed: 0.55, maxOpacity: 0.12 },
  { color: '#ff00ff', scaleH: 0.12, speed: 0.58, maxOpacity: 0.12 },
  { color: '#ff00ff', scaleH: 0.12, speed: 0.62, maxOpacity: 0.12 },
  { color: '#ff00ff', scaleH: 0.12, speed: 0.65, maxOpacity: 0.12 },
];

function WallPanel({ width, height, position, rotationY, phase }: WallPanelProps) {
  const stripCount = Math.max(20, Math.floor(width / 0.9));
  const gridLineCount = Math.floor(height / 1.5);
  const streamCount = 6;
  const pulseCount = 3;

  const stripRefs = useRef<Array<Mesh | null>>([]);
  const sweepRefs = useRef<Array<Mesh | null>>([]);
  const streamRefs = useRef<Array<Mesh | null>>([]);
  const pulseRefs = useRef<Array<Mesh | null>>([]);

  const stripX = useMemo(() => {
    if (stripCount === 1) return [0];
    const step = width / (stripCount - 1);
    return Array.from({ length: stripCount }, (_, i) => -width / 2 + i * step);
  }, [stripCount, width]);

  // Deterministic X positions for data streams based on wall phase
  const streamX = useMemo(() => {
    return Array.from({ length: streamCount }, (_, i) => {
      const seed = Math.sin(phase * 100 + i * 73.37) * 0.5;
      return (seed * width * 0.8);
    });
  }, [streamCount, width, phase]);

  // Pulse spawn Y positions
  const pulseSpawnY = useMemo(() => {
    return Array.from({ length: pulseCount }, (_, i) => {
      return -height * 0.3 + (i / (pulseCount - 1)) * height * 0.6;
    });
  }, [pulseCount, height]);

  const hueColor = useMemo(() => new Color(), []);
  let frameCount = 0;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    frameCount += 1;

    // --- Vertical strips with hue cycling (every 3rd frame) ---
    for (let i = 0; i < stripRefs.current.length; i += 1) {
      const mesh = stripRefs.current[i];
      if (!mesh) continue;
      const wave1 = Math.sin(t * 3.2 + phase + i * 0.4);
      const wave2 = Math.sin(t * 1.8 + phase * 2.1 + i * 0.7);
      const pulse = 0.08 + (0.28 * (wave1 + wave2 + 2)) / 4;
      setMaterialOpacity(mesh.material, pulse);

      // Hue cycling every 3rd frame
      if (frameCount % 3 === 0 && !Array.isArray(mesh.material)) {
        const hue = 0.52 + Math.sin(t * 0.8 + i * 0.15) * 0.05;
        hueColor.setHSL(hue, 1.0, 0.6);
        (mesh.material as unknown as { color: Color }).color.copy(hueColor);
      }
    }

    // --- Sweep bars (12 bars, 3 tiers) ---
    const travel = height * 0.82;
    for (let i = 0; i < sweepRefs.current.length; i += 1) {
      const mesh = sweepRefs.current[i];
      if (!mesh) continue;
      const bar = SWEEP_BARS[i];
      const progress = (t * bar.speed + phase * 0.15 + i * 0.25) % 1;
      mesh.position.y = -travel / 2 + progress * travel;
      const glow = 0.15 + Math.sin(progress * Math.PI) * bar.maxOpacity;
      setMaterialOpacity(mesh.material, glow);
    }

    // --- Data stream streaks (flow downward) ---
    const streamTravel = height * 0.9;
    for (let i = 0; i < streamRefs.current.length; i += 1) {
      const mesh = streamRefs.current[i];
      if (!mesh) continue;
      const speed = 0.3 + (i % 3) * 0.12;
      const progress = 1.0 - ((t * speed + phase * 0.3 + i * 0.4) % 1);
      mesh.position.y = -streamTravel / 2 + progress * streamTravel;
      // Sine-based fade: transparent at top/bottom, visible in middle
      const fade = Math.sin(progress * Math.PI) * 0.25;
      setMaterialOpacity(mesh.material, Math.max(0, fade));
    }

    // --- Energy pulse ripples ---
    for (let i = 0; i < pulseRefs.current.length; i += 1) {
      const mesh = pulseRefs.current[i];
      if (!mesh) continue;
      const pulseSpeed = 0.15 + i * 0.05;
      const cycle = (t * pulseSpeed + phase * 0.5 + i * 1.3) % 4.0;
      // Exponential decay from spawn
      const opacity = cycle < 1.0 ? 0.35 * Math.exp(-cycle * 3.0) : 0;
      setMaterialOpacity(mesh.material, Math.max(0, opacity));
      mesh.position.y = pulseSpawnY[i] + cycle * 1.2;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Base wall panel (z = 0.000) */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#020812"
          emissive="#00baff"
          emissiveIntensity={0.18}
          roughness={0.78}
          metalness={0.3}
        />
      </mesh>

      {/* Top edge trim */}
      <mesh position={[0, height / 2 - 0.12, 0.03]}>
        <boxGeometry args={[width, 0.07, 0.05]} />
        <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Bottom edge trim */}
      <mesh position={[0, -height / 2 + 0.12, 0.03]}>
        <boxGeometry args={[width, 0.07, 0.05]} />
        <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Horizontal grid lines (static, z = 0.015) */}
      {Array.from({ length: gridLineCount }, (_, i) => {
        const y = -height / 2 + ((i + 1) / (gridLineCount + 1)) * height;
        return (
          <mesh key={`grid-${i}`} position={[0, y, 0.015]}>
            <planeGeometry args={[width * 0.98, 0.03]} />
            <meshBasicMaterial
              color="#00d8ff"
              transparent
              opacity={0.12}
              blending={AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* Vertical strips (z = 0.020) */}
      {stripX.map((x, i) => (
        <mesh
          key={`strip-${i}`}
          ref={(node) => {
            stripRefs.current[i] = node;
          }}
          position={[x, 0, 0.02]}
        >
          <planeGeometry args={[0.10, height * 0.92]} />
          <meshBasicMaterial
            color="#00f6ff"
            transparent
            opacity={0.12}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Data stream streaks (z = 0.022) */}
      {streamX.map((x, i) => (
        <mesh
          key={`stream-${i}`}
          ref={(node) => {
            streamRefs.current[i] = node;
          }}
          position={[x, 0, 0.022]}
        >
          <planeGeometry args={[0.04, 2.5]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={0}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Sweep bars — 12 bars, 3 tiers (z = 0.025) */}
      {SWEEP_BARS.map((bar, i) => (
        <mesh
          key={`sweep-${i}`}
          ref={(node) => {
            sweepRefs.current[i] = node;
          }}
          position={[0, -height / 2, 0.025]}
        >
          <planeGeometry args={[width * 0.98, bar.scaleH]} />
          <meshBasicMaterial
            color={bar.color}
            transparent
            opacity={0.25}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Energy pulse ripples (z = 0.030) */}
      {Array.from({ length: pulseCount }, (_, i) => (
        <mesh
          key={`pulse-${i}`}
          ref={(node) => {
            pulseRefs.current[i] = node;
          }}
          position={[0, pulseSpawnY[i], 0.03]}
        >
          <planeGeometry args={[width * 0.96, 0.8]} />
          <meshBasicMaterial
            color="#00ffcc"
            transparent
            opacity={0}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Ceiling trim beam (static) */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, 0.15, 0.15]} />
        <meshStandardMaterial
          color="#00d8ff"
          emissive="#00d8ff"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CornerColumn({ position, height, index }: CornerColumnProps) {
  const cylinderRef = useRef<Mesh | null>(null);
  const ringRefs = useRef<Array<Mesh | null>>([]);
  const lightRef = useRef<PointLightType | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Pulsing emissive on cylinder
    if (cylinderRef.current && !Array.isArray(cylinderRef.current.material)) {
      const mat = cylinderRef.current.material as unknown as { emissiveIntensity: number };
      mat.emissiveIntensity = 1.5 + Math.sin(t * 2.0 + index * 1.5) * 0.8;
    }

    // Pulsing torus rings
    for (let i = 0; i < ringRefs.current.length; i += 1) {
      const mesh = ringRefs.current[i];
      if (!mesh) continue;
      const ringPulse = 0.3 + Math.sin(t * 2.5 + index * 1.5 + i * 2.0) * 0.3;
      setMaterialOpacity(mesh.material, ringPulse);
    }

    // Pulsing point light
    if (lightRef.current) {
      lightRef.current.intensity = 3 + Math.sin(t * 2.0) * 1.5;
    }
  });

  const ringPositions = [0.25, 0.50, 0.75];

  return (
    <group position={position}>
      {/* Main column cylinder */}
      <mesh ref={cylinderRef}>
        <cylinderGeometry args={[0.12, 0.12, height, 8]} />
        <meshStandardMaterial
          color="#00d8ff"
          emissive="#00d8ff"
          emissiveIntensity={1.5}
          toneMapped={false}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 3 torus rings at 25%, 50%, 75% height */}
      {ringPositions.map((pct, i) => (
        <mesh
          key={`ring-${i}`}
          ref={(node) => {
            ringRefs.current[i] = node;
          }}
          position={[0, -height / 2 + pct * height, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.25, 0.03, 8, 24]} />
          <meshBasicMaterial
            color="#00d8ff"
            transparent
            opacity={0.3}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Pulsing point light */}
      <pointLight
        ref={lightRef}
        color="#00d8ff"
        intensity={3}
        distance={10}
        decay={2}
      />
    </group>
  );
}

export function ArcadeWalls({ bounds }: ArcadeWallsProps) {
  const wallHeight = WALL_HEIGHT;
  const inset = 0.35;
  const spanX = bounds.maxX - bounds.minX;
  const spanZ = bounds.maxZ - bounds.minZ;
  const y = wallHeight / 2 - 0.02;

  return (
    <group>
      <WallPanel
        width={spanX}
        height={wallHeight}
        position={[bounds.floorCenter[0], y, bounds.minZ + inset]}
        rotationY={0}
        phase={0}
      />
      <WallPanel
        width={spanX}
        height={wallHeight}
        position={[bounds.floorCenter[0], y, bounds.maxZ - inset]}
        rotationY={Math.PI}
        phase={1.2}
      />
      <WallPanel
        width={spanZ}
        height={wallHeight}
        position={[bounds.minX + inset, y, bounds.floorCenter[2]]}
        rotationY={Math.PI / 2}
        phase={2.4}
      />
      <WallPanel
        width={spanZ}
        height={wallHeight}
        position={[bounds.maxX - inset, y, bounds.floorCenter[2]]}
        rotationY={-Math.PI / 2}
        phase={3.6}
      />

      {/* Animated corner columns */}
      {[
        [bounds.minX + inset, bounds.minZ + inset],
        [bounds.maxX - inset, bounds.minZ + inset],
        [bounds.minX + inset, bounds.maxZ - inset],
        [bounds.maxX - inset, bounds.maxZ - inset],
      ].map(([cx, cz], i) => (
        <CornerColumn
          key={`corner-${i}`}
          position={[cx, wallHeight / 2, cz]}
          height={wallHeight}
          index={i}
        />
      ))}
    </group>
  );
}
