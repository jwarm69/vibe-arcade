import { getGames } from '@/lib/games';
import { ArcadeCanvas } from '@/components/canvas/ArcadeCanvas';

export default function Home() {
  const games = getGames();

  return <ArcadeCanvas games={games} />;
}
