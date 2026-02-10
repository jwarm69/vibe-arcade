import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const raw = JSON.parse(readFileSync(join(root, 'content', 'games.json'), 'utf-8'));

let errors = 0;

// Check unique slugs
const slugs = raw.map((g) => g.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length > 0) {
  console.error(`Duplicate slugs: ${dupes.join(', ')}`);
  errors++;
}

for (const game of raw) {
  // Check required fields
  if (!game.slug || !game.title || !game.author || !game.embedUrl || !game.thumbnail) {
    console.error(`Missing required fields for game: ${JSON.stringify(game)}`);
    errors++;
  }

  // Check slug format
  if (!/^[a-z0-9-]+$/.test(game.slug)) {
    console.error(`Invalid slug format: ${game.slug}`);
    errors++;
  }

  // Check thumbnail exists
  const thumbPath = join(root, 'public', game.thumbnail.replace(/^\//, ''));
  if (!existsSync(thumbPath)) {
    console.error(`Thumbnail not found: ${game.thumbnail} (expected at ${thumbPath})`);
    errors++;
  }

  // Check cabinet position is [x, y, z]
  if (!Array.isArray(game.cabinet?.position) || game.cabinet.position.length !== 3) {
    console.error(`Invalid cabinet position for ${game.slug}`);
    errors++;
  }

  // Check rotationY is a number
  if (typeof game.cabinet?.rotationY !== 'number') {
    console.error(`Invalid cabinet rotationY for ${game.slug}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\nValidation failed with ${errors} error(s)`);
  process.exit(1);
} else {
  console.log(`Validated ${raw.length} game(s) — all checks passed`);
}
