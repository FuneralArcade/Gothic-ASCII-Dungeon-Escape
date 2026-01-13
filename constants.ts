
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

export const TRANSLATIONS = {
  EN: {
    status: 'STATUS',
    controls: 'CONTROLS',
    log: 'LOG',
    floor: 'STRATA:',
    sight: 'SIGHT:',
    key: 'KEY:',
    vitality: 'VITALITY',
    found: 'FOUND',
    missing: 'MISSING',
    move_n: 'MOVE NORTH',
    move_w: 'MOVE WEST',
    move_s: 'MOVE SOUTH',
    move_e: 'MOVE EAST',
    wait: 'WAIT',
    despair: 'FAILURE',
    signal_lost: 'SIGNAL LOST ON STRATA ',
    reboot: 'REBOOT',
    log_descend: 'Descending to strata ',
    log_locked: 'The door is locked. (Key required)',
    log_hit: 'Hit enemy: -',
    log_kill: 'Enemy defeated.',
    log_death: 'You died.',
    log_hurt: 'Damage taken: -',
    log_key: 'Found the key.',
    log_light: 'Found a lantern. Vision increased.',
    log_potion: 'Found a potion. HP restored.',
    booting: 'BOOTING...'
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
    despair: '任务失败',
    signal_lost: '在第 _ 层失去信号',
    reboot: '重启系统',
    log_descend: '正在进入层级 ',
    log_locked: '门已锁住（需要钥匙）。',
    log_hit: '攻击敌人：-',
    log_kill: '敌人已消灭。',
    log_death: '你已经死亡。',
    log_hurt: '受到伤害：-',
    log_key: '找到了钥匙。',
    log_light: '找到了提灯。视野扩大。',
    log_potion: '找到了药水。生命值恢复。',
    booting: '系统启动中...'
  }
};
