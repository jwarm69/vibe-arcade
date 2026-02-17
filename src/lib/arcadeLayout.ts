import type { ArcadeBounds, GameEntry, PlacedGameEntry } from '@/types';

const CABINETS_PER_SIDE = 6;
const CABINETS_PER_ROOM = CABINETS_PER_SIDE * 2;
const CABINET_SPACING_X = 3.2;
const CABINET_ROW_OFFSET_Z = 6;
const ROOM_DEPTH = 20;
const ROOM_GAP_Z = 8;
const BOUNDS_PADDING = 9;

function autoPlaceCabinet(index: number) {
  const roomIndex = Math.floor(index / CABINETS_PER_ROOM);
  const slotIndex = index % CABINETS_PER_ROOM;
  const side: 'north' | 'south' = slotIndex < CABINETS_PER_SIDE ? 'north' : 'south';
  const sideSlot = slotIndex % CABINETS_PER_SIDE;
  const rowWidth = (CABINETS_PER_SIDE - 1) * CABINET_SPACING_X;
  const roomCenterZ = -roomIndex * (ROOM_DEPTH + ROOM_GAP_Z);
  const x = -rowWidth / 2 + sideSlot * CABINET_SPACING_X;
  const z = roomCenterZ + (side === 'north' ? -CABINET_ROW_OFFSET_Z : CABINET_ROW_OFFSET_Z);
  const rotationY = side === 'north' ? 0 : Math.PI;

  return {
    position: [x, 0, z] as [number, number, number],
    rotationY,
    roomIndex,
    slotIndex,
    side,
  };
}

function calcBounds(placedGames: PlacedGameEntry[]): ArcadeBounds {
  if (placedGames.length === 0) {
    return {
      minX: -15,
      maxX: 15,
      minZ: -15,
      maxZ: 15,
      floorCenter: [0, 0, 0],
      floorSize: 30,
    };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const game of placedGames) {
    const [x, , z] = game.cabinet.position;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }

  minX -= BOUNDS_PADDING;
  maxX += BOUNDS_PADDING;
  minZ -= BOUNDS_PADDING;
  maxZ += BOUNDS_PADDING;

  const spanX = maxX - minX;
  const spanZ = maxZ - minZ;
  const floorSize = Math.max(50, spanX, spanZ) + BOUNDS_PADDING * 2;
  const floorCenter: [number, number, number] = [
    (minX + maxX) / 2,
    0,
    (minZ + maxZ) / 2,
  ];

  return { minX, maxX, minZ, maxZ, floorCenter, floorSize };
}

export function buildArcadeLayout(games: GameEntry[]) {
  let autoIndex = 0;

  const placedGames: PlacedGameEntry[] = games.map((game) => {
    if (game.cabinet) {
      return {
        ...game,
        cabinet: game.cabinet,
        layout: {
          autoPlaced: false,
          roomIndex: null,
          slotIndex: null,
          side: null,
        },
      };
    }

    const placement = autoPlaceCabinet(autoIndex);
    autoIndex += 1;

    return {
      ...game,
      cabinet: {
        position: placement.position,
        rotationY: placement.rotationY,
      },
      layout: {
        autoPlaced: true,
        roomIndex: placement.roomIndex,
        slotIndex: placement.slotIndex,
        side: placement.side,
      },
    };
  });

  return {
    games: placedGames,
    bounds: calcBounds(placedGames),
  };
}
