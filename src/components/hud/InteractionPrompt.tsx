'use client';

import { useArcadeStore } from '@/hooks/useArcadeStore';

export function InteractionPrompt() {
  const mode = useArcadeStore((s) => s.mode);
  const focusedGame = useArcadeStore((s) => s.focusedGame);

  if (mode !== 'ARCADE' || !focusedGame) return null;

  return (
    <div className="pointer-events-none fixed left-4 top-4">
      <div className="rounded bg-black/70 px-4 py-2 backdrop-blur-sm">
        <span className="text-sm text-white">
          Press{' '}
          <kbd className="rounded border border-green-400/50 bg-green-400/10 px-1.5 py-0.5 font-mono text-xs text-green-400">
            R
          </kbd>{' '}
          to play{' '}
          <span className="font-bold text-green-400">{focusedGame.title}</span>
        </span>
      </div>
    </div>
  );
}
