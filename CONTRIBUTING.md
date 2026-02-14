# Contributing

## Adding a Game

1. Edit `content/games.json` and add an entry:

```json
{
  "slug": "my-game",
  "title": "My Game",
  "author": "Author Name",
  "embedUrl": "https://example.com/game",
  "thumbnail": "/thumbnails/my-game.png",
  "cabinet": {
    "position": [6, 0, -5],
    "rotationY": 0
  }
}
```

`cabinet` is optional. If omitted, the game is auto-placed into the scalable multi-room layout.

2. Add a thumbnail image to `public/thumbnails/`
   - Format: PNG
   - Recommended: 512x512
   - The image appears on the cabinet screen

3. Run validation:

```bash
npm run validate:games
```

## Thumbnail Requirements

- **Format:** PNG
- **Size:** 512x512 recommended (will be stretched to fit cabinet screen)
- **Content:** Game screenshot or logo on a dark background works best

## iframe Embedding Caveats

Not all sites allow iframe embedding. Sites with `X-Frame-Options: DENY` or restrictive CSP headers will show the fallback "Open in New Tab" UI. Test your embed URL before adding it.

## Cabinet Positioning (Optional Override)

- Cabinets are placed using `[x, y, z]` coordinates
- Y should be `0` (floor level)
- `rotationY` is in radians (0 = facing +Z, Math.PI = facing -Z)
- Space cabinets at least 2 units apart to avoid overlap

## Development

```bash
npm run dev             # Start dev server
npm run build           # Production build
npm run validate:games  # Validate game registry
```
