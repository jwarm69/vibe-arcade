'use client';

import { Html } from '@react-three/drei';
import { CABINET_HEIGHT } from '@/lib/constants';

interface CabinetLabelProps {
  title: string;
  author: string;
  visible: boolean;
}

export function CabinetLabel({ title, author, visible }: CabinetLabelProps) {
  if (!visible) return null;

  return (
    <Html
      position={[0, CABINET_HEIGHT / 2 + 0.25, 0]}
      center
      distanceFactor={4}
      style={{ pointerEvents: 'none' }}
    >
      <div className="whitespace-nowrap rounded bg-black/80 px-3 py-1.5 text-center backdrop-blur-sm">
        <div className="text-sm font-bold text-green-400">{title}</div>
        <div className="text-xs text-gray-400">by {author}</div>
      </div>
    </Html>
  );
}
