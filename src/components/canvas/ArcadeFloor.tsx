'use client';

import { MeshReflectorMaterial } from '@react-three/drei';
import type { ArcadeBounds } from '@/types';

interface ArcadeFloorProps {
  bounds: ArcadeBounds;
}

export function ArcadeFloor({ bounds }: ArcadeFloorProps) {
  const divisions = Math.max(30, Math.round(bounds.floorSize / 2));

  return (
    <group>
      {/* Reflective dark floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[bounds.floorCenter[0], -0.01, bounds.floorCenter[2]]}
        receiveShadow
      >
        <planeGeometry args={[bounds.floorSize, bounds.floorSize]} />
        <MeshReflectorMaterial
          resolution={512}
          mixStrength={0.4}
          blur={[300, 100]}
          roughness={0.85}
          color="#000a00"
          mirror={0}
        />
      </mesh>

      {/* Green grid lines */}
      <gridHelper
        args={[bounds.floorSize, divisions, '#00ff41', '#003300']}
        position={[bounds.floorCenter[0], 0, bounds.floorCenter[2]]}
      />
    </group>
  );
}
