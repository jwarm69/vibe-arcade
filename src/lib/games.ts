import { readFileSync } from 'fs';
import { join } from 'path';
import { gamesArraySchema } from './schema';
import type { GameEntry } from '@/types';

export function getGames(): GameEntry[] {
  const filePath = join(process.cwd(), 'content', 'games.json');
  const raw = JSON.parse(readFileSync(filePath, 'utf-8'));
  return gamesArraySchema.parse(raw);
}
