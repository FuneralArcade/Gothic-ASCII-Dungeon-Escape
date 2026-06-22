
export const MAP_WIDTH = 60;
export const MAP_HEIGHT = 40;
export const INITIAL_HP = 100;
export const INITIAL_VISION = 2;
export const UPGRADED_VISION = 5;
export const FINAL_FLOOR = 5;

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
  topLeft: '\u2554',
  topRight: '\u2557',
  bottomLeft: '\u255a',
  bottomRight: '\u255d',
  horizontal: '\u2550',
  vertical: '\u2551'
};

export const TRANSLATIONS = {
  EN: {
    status: 'CONDITION',
    controls: 'CONTROLS',
    log: 'LOG',
    floor: 'DEPTH:',
    sight: 'SIGHT:',
    key: 'RELIQUARY KEY:',
    vitality: 'VITALITY',
    found: 'FOUND',
    missing: 'MISSING',
    move_n: 'MOVE NORTH',
    move_w: 'MOVE WEST',
    move_s: 'MOVE SOUTH',
    move_e: 'MOVE EAST',
    wait: 'WAIT',
    despair: 'YOU PERISHED',
    signal_lost: 'SIGNAL LOST ON STRATA {floor}',
    reboot: 'TRY AGAIN',
    log_descend: 'Descending to strata ',
    log_locked: 'The door is locked. (Key required)',
    log_hit: 'Hit enemy: -',
    log_kill: 'Enemy defeated.',
    log_death: 'You died.',
    log_hurt: 'The abyss wounds you: -',
    log_key: 'Found the key.',
    log_light: 'Found a lantern. Vision increased.',
    log_potion: 'Found a potion. HP restored.',
    booting: 'BOOTING...',
    victory: 'ASCENSION',
    victory_desc: 'YOU HAVE ESCAPED THE DARK ABYSS',
    victory_sub: 'REACHED THE SUNLIT SURFACE FROM DEPTH ',
    victory_btn: 'BEGIN NEW DESCENT'
  },
  CN: {
    status: '\u72b6\u6001',
    controls: '\u63a7\u5236',
    log: '\u65e5\u5fd7',
    floor: '\u5c42\u7ea7:',
    sight: '\u89c6\u91ce:',
    key: '\u94a5\u5319:',
    vitality: '\u751f\u547d\u503c',
    found: '\u5df2\u83b7\u5f97',
    missing: '\u672a\u83b7\u5f97',
    move_n: '\u5411\u4e0a\u79fb\u52a8',
    move_w: '\u5411\u5de6\u79fb\u52a8',
    move_s: '\u5411\u4e0b\u79fb\u52a8',
    move_e: '\u5411\u53f3\u79fb\u52a8',
    wait: '\u539f\u5730\u5f85\u547d',
    despair: '\u6b7b\u4ea1',
    signal_lost: '\u5728\u7b2c {floor} \u5c42\u88ab\u6df1\u6e0a\u541e\u566c',
    reboot: '\u91cd\u65b0\u8fdb\u5165',
    log_descend: '\u6b63\u5728\u8fdb\u5165\u5c42\u7ea7 ',
    log_locked: '\u95e8\u5df2\u9501\u4f4f\uff08\u9700\u8981\u94a5\u5319\uff09\u3002',
    log_hit: '\u653b\u51fb\u654c\u4eba\uff1a-',
    log_kill: '\u654c\u4eba\u5df2\u6d88\u706d\u3002',
    log_death: '\u4f60\u5df2\u7ecf\u6b7b\u4ea1\u3002',
    log_hurt: '\u53d7\u5230\u4f24\u5bb3\uff1a-',
    log_key: '\u627e\u5230\u4e86\u94a5\u5319\u3002',
    log_light: '\u627e\u5230\u4e86\u63d0\u706f\u3002\u89c6\u91ce\u6269\u5927\u3002',
    log_potion: '\u627e\u5230\u4e86\u836f\u6c34\u3002\u751f\u547d\u503c\u6062\u590d\u3002',
    booting: '\u7cfb\u7edf\u542f\u52a8\u4e2d...',
    victory: '\u91cd\u89c1\u5929\u65e5',
    victory_desc: '\u6210\u529f\u9003\u79bb\u5730\u7262',
    victory_sub: '\u6210\u529f\u9003\u751f\uff0c\u6700\u7ec8\u62b5\u8fbe\u5c42\u7ea7\uff1a',
    victory_btn: '\u91cd\u65b0\u63a2\u7d22'
  }
};
