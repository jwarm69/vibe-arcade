export interface GameEntry {
  slug: string;
  title: string;
  author: string;
  embedUrl: string;
  thumbnail: string;
  cabinet?: {
    position: [number, number, number];
    rotationY: number;
  };
}

export type ArcadeMode = 'ARCADE' | 'PLAYING' | 'PAUSED';

export interface PlacedGameEntry extends Omit<GameEntry, 'cabinet'> {
  cabinet: {
    position: [number, number, number];
    rotationY: number;
  };
  layout: {
    autoPlaced: boolean;
    roomIndex: number | null;
    slotIndex: number | null;
    side: 'north' | 'south' | null;
  };
}

export interface ArcadeBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  floorCenter: [number, number, number];
  floorSize: number;
}
