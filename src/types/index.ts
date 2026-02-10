export interface GameEntry {
  slug: string;
  title: string;
  author: string;
  embedUrl: string;
  thumbnail: string;
  cabinet: {
    position: [number, number, number];
    rotationY: number;
  };
}

export type ArcadeMode = 'ARCADE' | 'PLAYING' | 'PAUSED';
