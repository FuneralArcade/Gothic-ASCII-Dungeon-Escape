
export const MAP_WIDTH = 60;
export const MAP_HEIGHT = 40;
export const INITIAL_HP = 100;
export const INITIAL_VISION = 2;
export const UPGRADED_VISION = 5;

export const TILE_COLORS: Record<string, string> = {
  '@': 'text-white font-bold',
  '#': 'text-gray-700',
  '.': 'text-gray-900',
  'L': 'text-yellow-600 animate-pulse',
  'K': 'text-yellow-400 font-bold',
  'P': 'text-green-500',
  'E': 'text-red-600 font-bold',
  'D': 'text-cyan-400 font-bold shadow-lg',
  ' ': 'text-black'
};

export const GOTHIC_BORDERS = {
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║'
};
