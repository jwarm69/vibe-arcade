import { create } from 'zustand';
import type { ArcadeMode, GameEntry } from '@/types';
import {
  trackGameStart,
  trackGamePause,
  trackGameResume,
  trackGameExit,
} from '@/lib/analytics';

interface ArcadeState {
  mode: ArcadeMode;
  focusedGame: GameEntry | null;
  activeGame: GameEntry | null;
  savedPosition: [number, number, number] | null;
  savedRotation: [number, number] | null;

  setFocusedGame: (game: GameEntry | null) => void;
  startPlaying: () => void;
  pause: () => void;
  resume: () => void;
  returnToArcade: () => void;
}

export const useArcadeStore = create<ArcadeState>((set, get) => ({
  mode: 'ARCADE',
  focusedGame: null,
  activeGame: null,
  savedPosition: null,
  savedRotation: null,

  setFocusedGame: (game) => {
    if (get().mode !== 'ARCADE') return;
    set({ focusedGame: game });
  },

  startPlaying: () => {
    const { mode, focusedGame } = get();
    if (mode !== 'ARCADE' || !focusedGame) return;
    trackGameStart(focusedGame.slug, focusedGame.title);
    set({ mode: 'PLAYING', activeGame: focusedGame });
  },

  pause: () => {
    const { mode, activeGame } = get();
    if (mode !== 'PLAYING') return;
    if (activeGame) trackGamePause(activeGame.slug);
    set({ mode: 'PAUSED' });
  },

  resume: () => {
    const { mode, activeGame } = get();
    if (mode !== 'PAUSED') return;
    if (activeGame) trackGameResume(activeGame.slug);
    set({ mode: 'PLAYING' });
  },

  returnToArcade: () => {
    const { mode, activeGame } = get();
    if (mode !== 'PAUSED' && mode !== 'PLAYING') return;
    if (activeGame) trackGameExit(activeGame.slug);
    set({ mode: 'ARCADE', activeGame: null });
  },
}));
