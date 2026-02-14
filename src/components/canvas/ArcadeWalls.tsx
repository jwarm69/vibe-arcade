'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ArcadeBounds } from '@/types';
import { AdditiveBlending } from 'three';
import type { Material, Mesh } from 'three';

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

function setMaterialOpacity(material: Material | Material[], opacity: number) {
  if (Array.isArray(material)) return;
  material.opacity = opacity;
}

function WallPanel({ width, height, position, rotationY, phase }: WallPanelProps) {
  const stripCount = Math.max(12, Math.floor(width / 1.8));
  const stripRefs = useRef<Array<Mesh | null>>([]);
  const sweepRefs = useRef<Array<Mesh | null>>([]);

  const stripX = useMemo(() => {
    if (stripCount === 1) return [0];
    const step = width / (stripCount - 1);
    return Array.from({ length: stripCount }, (_, i) => -width / 2 + i * step);
  }, [stripCount, width]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    for (let i = 0; i < stripRefs.current.length; i += 1) {
      const mesh = stripRefs.current[i];
      if (!mesh) continue;
      const pulse = 0.06 + (0.16 * (Math.sin(t * 2.7 + phase + i * 0.5) + 1)) / 2;
      setMaterialOpacity(mesh.material, pulse);
    }

    const travel = height * 0.82;
    for (let i = 0; i < sweepRefs.current.length; i += 1) {
      const mesh = sweepRefs.current[i];
      if (!mesh) continue;
      const progress = (t * 0.24 + phase * 0.1 + i * 0.33) % 1;
      mesh.position.y = -travel / 2 + progress * travel;
      const glow = 0.1 + Math.sin(progress * Math.PI) * 0.45;
      setMaterialOpacity(mesh.material, glow);
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#020812"
          emissive="#00baff"
          emissiveIntensity={0.12}
          roughness={0.78}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, height / 2 - 0.12, 0.03]}>
        <boxGeometry args={[width, 0.07, 0.05]} />
        <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={1} toneMapped={false} />
      </mesh>

      <mesh position={[0, -height / 2 + 0.12, 0.03]}>
        <boxGeometry args={[width, 0.07, 0.05]} />
        <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={1} toneMapped={false} />
      </mesh>

      {stripX.map((x, i) => (
        <mesh
          key={`strip-${i}`}
          ref={(node) => {
            stripRefs.current[i] = node;
          }}
          position={[x, 0, 0.02]}
        >
          <planeGeometry args={[0.08, height * 0.88]} />
          <meshBasicMaterial
            color="#00f6ff"
            transparent
            opacity={0.12}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}

      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={`sweep-${i}`}
          ref={(node) => {
            sweepRefs.current[i] = node;
          }}
          position={[0, -height / 2, 0.025]}
        >
          <planeGeometry args={[width * 0.96, 0.22]} />
          <meshBasicMaterial
            color="#9fffff"
            transparent
            opacity={0.25}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function ArcadeWalls({ bounds }: ArcadeWallsProps) {
  const wallHeight = 8;
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
    </group>
  );
}
