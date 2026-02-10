'use client';

import { MeshReflectorMaterial } from '@react-three/drei';
import { FLOOR_SIZE } from '@/lib/constants';

export function ArcadeFloor() {
  return (
    <group>
      {/* Reflective dark floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
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
        args={[FLOOR_SIZE, 30, '#00ff41', '#003300']}
        position={[0, 0, 0]}
      />
    </group>
  );
}
