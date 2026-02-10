/** Shared mutable state read by PlayerController on each frame. */
export const touchState = {
  /** Joystick axes, –1 … +1. x = right, y = down (screen coords). */
  move: { x: 0, y: 0 },
  /** Accumulated look‐drag pixels since last frame. Reset after consumption. */
  lookDelta: { x: 0, y: 0 },
  /** Set once on mount; true when touch device detected. */
  isMobile: false,
};
