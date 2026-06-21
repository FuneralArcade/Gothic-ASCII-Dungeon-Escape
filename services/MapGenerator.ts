
import { TileType, Position } from '../types';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';

export class MapGenerator {
  static generate(width: number, height: number, floorNumber: number) {
    const map: TileType[][] = Array(height).fill(null).map(() => Array(width).fill(TileType.ROCK));
    
    // Random Walker to carve a cave
    let x = Math.floor(width / 2);
    let y = Math.floor(height / 2);
    let floorCount = 0;
    const targetFloorCount = Math.floor(width * height * 0.3); // 30% of map should be floor

    while (floorCount < targetFloorCount) {
      if (map[y][x] === TileType.ROCK) {
        map[y][x] = TileType.FLOOR;
        floorCount++;
      }

      const dir = Math.floor(Math.random() * 4);
      if (dir === 0 && x > 2) x--;
      if (dir === 1 && x < width - 3) x++;
      if (dir === 2 && y > 2) y--;
      if (dir === 3 && y < height - 3) y++;
    }

    // Add Walls at the edges of the floor
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        if (map[j][i] === TileType.FLOOR) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = j + dy;
              const nx = i + dx;
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                if (map[ny][nx] === TileType.ROCK) {
                  map[ny][nx] = TileType.WALL;
                }
              }
            }
          }
        }
      }
    }

    return map;
  }

  static getValidSpawn(map: TileType[][]): Position {
    let x, y;
    do {
      x = Math.floor(Math.random() * MAP_WIDTH);
      y = Math.floor(Math.random() * MAP_HEIGHT);
    } while (map[y][x] !== TileType.FLOOR);
    return { x, y };
  }

  static getValidSpawnFar(
    map: TileType[][],
    avoidPoints: { pos: Position; minDist: number }[],
    occupiedPositions: Position[]
  ): Position {
    let x = 0;
    let y = 0;
    let attempts = 0;
    const maxAttempts = 300;

    while (attempts < maxAttempts) {
      x = Math.floor(Math.random() * MAP_WIDTH);
      y = Math.floor(Math.random() * MAP_HEIGHT);
      attempts++;

      // Must be a floor tile
      if (map[y][x] !== TileType.FLOOR) continue;

      // Must not be in occupied positions
      const isOccupied = occupiedPositions.some(p => p.x === x && p.y === y);
      if (isOccupied) continue;

      // Check all avoid points
      let fine = true;
      for (const avoid of avoidPoints) {
        const dist = Math.abs(x - avoid.pos.x) + Math.abs(y - avoid.pos.y);
        if (dist < avoid.minDist) {
          fine = false;
          break;
        }
      }

      if (fine) {
        return { x, y };
      }
    }

    // Fallback: Find any unoccupied floor tile
    for (let i = 0; i < 200; i++) {
      x = Math.floor(Math.random() * MAP_WIDTH);
      y = Math.floor(Math.random() * MAP_HEIGHT);
      if (map[y][x] === TileType.FLOOR && !occupiedPositions.some(p => p.x === x && p.y === y)) {
        return { x, y };
      }
    }

    // Absolute fallback: scan the map
    for (let j = 0; j < MAP_HEIGHT; j++) {
      for (let i = 0; i < MAP_WIDTH; i++) {
        if (map[j][i] === TileType.FLOOR && !occupiedPositions.some(p => p.x === i && p.y === j)) {
          return { x: i, y: j };
        }
      }
    }

    return { x: Math.floor(MAP_WIDTH / 2), y: Math.floor(MAP_HEIGHT / 2) };
  }
}
