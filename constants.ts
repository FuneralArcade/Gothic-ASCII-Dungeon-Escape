
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
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║'
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
    status: '状态',
    controls: '控制',
    log: '日志',
    floor: '层级:',
    sight: '视野:',
    key: '钥匙:',
    vitality: '生命值',
    found: '已获得',
    missing: '未获得',
    move_n: '向上移动',
    move_w: '向左移动',
    move_s: '向下移动',
    move_e: '向右移动',
    wait: '原地待命',
    despair: '死亡',
    signal_lost: '在第 {floor} 层被深渊吞噬',
    reboot: '重新进入',
    log_descend: '正在进入层级 ',
    log_locked: '门已锁住（需要钥匙）。',
    log_hit: '攻击敌人：-',
    log_kill: '敌人已消灭。',
    log_death: '你已经死亡。',
    log_hurt: '受到伤害：-',
    log_key: '找到了钥匙。',
    log_light: '找到了提灯。视野扩大。',
    log_potion: '找到了药水。生命值恢复。',
    booting: '系统启动中...',
    victory: '重见天日',
    victory_desc: '成功逃离地牢',
    victory_sub: '成功逃生，最终抵达层级：',
    victory_btn: '重新探索'
  }
};
