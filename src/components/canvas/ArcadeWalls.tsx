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
  const stripCount = Math.max(20, Math.floor(width / 0.9));
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
      const wave1 = Math.sin(t * 3.2 + phase + i * 0.4);
      const wave2 = Math.sin(t * 1.8 + phase * 2.1 + i * 0.7);
      const pulse = 0.08 + (0.28 * (wave1 + wave2 + 2)) / 4;
      setMaterialOpacity(mesh.material, pulse);
    }

    const travel = height * 0.82;
    for (let i = 0; i < sweepRefs.current.length; i += 1) {
      const mesh = sweepRefs.current[i];
      if (!mesh) continue;
      const speed = 0.35 + (i % 3) * 0.08;
      const progress = (t * speed + phase * 0.15 + i * 0.25) % 1;
      mesh.position.y = -travel / 2 + progress * travel;
      const glow = 0.15 + Math.sin(progress * Math.PI) * 0.65;
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
          emissiveIntensity={0.18}
          roughness={0.78}
          metalness={0.3}
        />
      </mesh>

      <mesh position={[0, height / 2 - 0.12, 0.03]}>
        <boxGeometry args={[width, 0.07, 0.05]} />
        <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      <mesh position={[0, -height / 2 + 0.12, 0.03]}>
        <boxGeometry args={[width, 0.07, 0.05]} />
        <meshStandardMaterial color="#00d8ff" emissive="#00d8ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>

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

      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`sweep-${i}`}
          ref={(node) => {
            sweepRefs.current[i] = node;
          }}
          position={[0, -height / 2, 0.025]}
        >
          <planeGeometry args={[width * 0.98, 0.35]} />
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
  const wallHeight = 14;
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

      {/* Corner glow columns */}
      {[
        [bounds.minX + inset, bounds.minZ + inset],
        [bounds.maxX - inset, bounds.minZ + inset],
        [bounds.minX + inset, bounds.maxZ - inset],
        [bounds.maxX - inset, bounds.maxZ - inset],
      ].map(([cx, cz], i) => (
        <group key={`corner-${i}`} position={[cx, wallHeight / 2, cz]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, wallHeight, 8]} />
            <meshStandardMaterial
              color="#00d8ff"
              emissive="#00d8ff"
              emissiveIntensity={1.5}
              toneMapped={false}
              transparent
              opacity={0.6}
            />
          </mesh>
          <pointLight color="#00d8ff" intensity={3} distance={8} decay={2} />
        </group>
      ))}
    </group>
  );
}
