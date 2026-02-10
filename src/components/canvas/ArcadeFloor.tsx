'use client';

import { FLOOR_SIZE } from '@/lib/constants';

export function ArcadeFloor() {
  return (
    <group>
      {/* Black base plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
        <meshStandardMaterial color="#000000" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Green grid lines */}
      <gridHelper
        args={[FLOOR_SIZE, 30, '#00ff41', '#003300']}
        position={[0, 0, 0]}
      />
    </group>
  );
}
