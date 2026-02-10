'use client';

import { Text } from '@react-three/drei';

export function NeonSign() {
  return (
    <group position={[0, 4, -8]}>
      <Text
        fontSize={1}
        color="#00ff41"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        outlineWidth={0.02}
        outlineColor="#00ff41"
      >
        VIBE ARCADE
        <meshStandardMaterial
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Text>
    </group>
  );
}
