import { create } from 'zustand';
import type { ArcadeMode, GameEntry } from '@/types';

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
    set({ mode: 'PLAYING', activeGame: focusedGame });
  },

  pause: () => {
    if (get().mode !== 'PLAYING') return;
    set({ mode: 'PAUSED' });
  },

  resume: () => {
    if (get().mode !== 'PAUSED') return;
    set({ mode: 'PLAYING' });
  },

  returnToArcade: () => {
    const { mode } = get();
    if (mode !== 'PAUSED' && mode !== 'PLAYING') return;
    set({ mode: 'ARCADE', activeGame: null });
  },
}));
