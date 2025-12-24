
export enum TileType {
  ROCK = ' ',
  FLOOR = '.',
  WALL = '#',
  DOOR = 'D',
  LANTERN = 'L',
  KEY = 'K',
  POTION = 'P',
  ENEMY = 'E',
  PLAYER = '@'
}

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  type: TileType;
  pos: Position;
  hp?: number;
  maxHp?: number;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'combat' | 'item' | 'danger';
}

export interface GameState {
  player: Entity;
  entities: Entity[];
  map: TileType[][];
  explored: boolean[][];
  visited: boolean[][];
  visionRadius: number;
  hasKey: boolean;
  floor: number;
  logs: LogEntry[];
}
