'use client';

import { useArcadeStore } from '@/hooks/useArcadeStore';

export function Crosshair() {
  const mode = useArcadeStore((s) => s.mode);
  if (mode !== 'ARCADE') return null;

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      <div className="h-1 w-1 rounded-full bg-green-400/70" />
    </div>
  );
}
