import { track } from '@vercel/analytics';

let sessionStart: number | null = null;
let sessionGame: string | null = null;

export function trackGameStart(slug: string, title: string) {
  sessionStart = Date.now();
  sessionGame = slug;
  track('game_start', { slug, title });
}

export function trackGamePause(slug: string) {
  const duration = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
  track('game_pause', { slug, play_seconds: duration });
}

export function trackGameResume(slug: string) {
  track('game_resume', { slug });
}

export function trackGameExit(slug: string) {
  const duration = sessionStart ? Math.round((Date.now() - sessionStart) / 1000) : 0;
  track('game_exit', { slug, session_seconds: duration });
  sessionStart = null;
  sessionGame = null;
}

export function trackOpenInNewTab(slug: string, url: string) {
  track('game_open_new_tab', { slug, url });
}
