'use client';

import { useTexture } from '@react-three/drei';
import {
  CABINET_WIDTH,
  SCREEN_HEIGHT,
  SCREEN_Y_OFFSET,
  CABINET_DEPTH,
} from '@/lib/constants';

interface CabinetScreenProps {
  thumbnail: string;
  isFocused: boolean;
}

export function CabinetScreen({ thumbnail, isFocused }: CabinetScreenProps) {
  const texture = useTexture(thumbnail);

  return (
    <mesh
      position={[0, SCREEN_Y_OFFSET, CABINET_DEPTH / 2 + 0.01]}
    >
      <planeGeometry args={[CABINET_WIDTH * 0.8, SCREEN_HEIGHT]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive={isFocused ? '#00ff41' : '#003300'}
        emissiveIntensity={isFocused ? 0.8 : 0.3}
        toneMapped={false}
      />
    </mesh>
  );
}
