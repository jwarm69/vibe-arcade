'use client';

import { Text } from '@react-three/drei';

export function NeonSign() {
  return (
    <group position={[0, 3.5, -6]}>
      <Text
        fontSize={2.5}
        color="#00ff41"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#00ff41"
      >
        VIBE ARCADE
        <meshStandardMaterial
          color="#00ff41"
          emissive="#00ff41"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </Text>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Presented by Warman Consulting
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </Text>
      <pointLight color="#00ff41" intensity={6} distance={20} />
    </group>
  );
}
