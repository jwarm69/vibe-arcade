# Vibe Arcade

A 3D virtual arcade built with Next.js, React Three Fiber, and Tailwind CSS. Walk around a neon-lit room, approach arcade cabinets, and play embedded web games.

## Tech Stack

- **Next.js 16** (App Router, server components)
- **React Three Fiber** + **drei** (3D rendering)
- **Zustand** (state machine)
- **Zod** (schema validation)
- **Tailwind CSS v4**

## Controls

| Key | Action |
|-----|--------|
| **Click** | Lock mouse for looking around |
| **WASD / Arrow Keys** | Move |
| **Mouse** | Look around |
| **R** | Play focused game |
| **Escape** | Pause / Resume |

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev             # Development server
npm run build           # Production build
npm run validate:games  # Validate game registry
```

## Architecture

- **State Machine** — Zustand store with `ARCADE -> PLAYING -> PAUSED` transitions
- **Keyboard** — Single centralized hook, movement via refs (zero re-renders)
- **Proximity** — Per-frame distance + facing check in `useFrame`
- **Data** — Server component loads `content/games.json`, passes to client canvas
- **Layout Engine** — Auto-places games into scalable multi-room rows when cabinet coordinates are omitted
