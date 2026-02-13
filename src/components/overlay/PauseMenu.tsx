'use client';

import { useArcadeStore } from '@/hooks/useArcadeStore';
import { trackOpenInNewTab } from '@/lib/analytics';

export function PauseMenu() {
  const mode = useArcadeStore((s) => s.mode);
  const activeGame = useArcadeStore((s) => s.activeGame);
  const resume = useArcadeStore((s) => s.resume);
  const returnToArcade = useArcadeStore((s) => s.returnToArcade);

  if (mode !== 'PAUSED' || !activeGame) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex w-72 flex-col gap-3 rounded-xl border border-green-400/20 bg-gray-900/90 p-6">
        <h2 className="text-center text-lg font-bold text-green-400">
          {activeGame.title}
        </h2>
        <p className="text-center text-sm text-gray-400">Paused</p>

        <div className="mt-2 flex flex-col gap-2">
          <button
            onClick={resume}
            className="rounded-lg bg-green-500 px-4 py-2.5 font-bold text-black transition hover:bg-green-400"
          >
            Resume
          </button>
          <button
            onClick={returnToArcade}
            className="rounded-lg border border-green-400/20 bg-green-400/5 px-4 py-2.5 font-medium text-white transition hover:bg-green-400/10"
          >
            Return to Arcade
          </button>
          <a
            href={activeGame.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOpenInNewTab(activeGame.slug, activeGame.embedUrl)}
            className="rounded-lg border border-green-400/10 bg-green-400/5 px-4 py-2.5 text-center font-medium text-gray-400 transition hover:bg-green-400/10 hover:text-white"
          >
            Open in New Tab
          </a>
        </div>
      </div>
    </div>
  );
}
