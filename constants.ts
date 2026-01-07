
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
    floor: 'Floor_Level:',
    sight: 'Sight_Range:',
    key: 'Relic_Key:',
    vitality: 'VITALITY_CORE',
    found: 'DETECTED',
    missing: 'NOT_FOUND',
    move_n: 'MOVE_NORTH',
    move_w: 'MOVE_WEST',
    move_s: 'MOVE_SOUTH',
    move_e: 'MOVE_EAST',
    wait: 'STAY_IDLE',
    despair: 'Despair',
    signal_lost: 'SIGNAL_LOST_ON_STRATA_',
    reboot: 'Reboot_Soul',
    log_descend: 'Accessed conduit. Descending to floor ',
    log_locked: 'Conduit is locked. Terminal key required.',
    log_hit: 'Neutralizing threat: -',
    log_kill: 'Threat neutralized.',
    log_death: 'Core failure. System offline.',
    log_hurt: 'Warning: Integrity breached. -',
    log_key: 'Terminal key acquired.',
    log_light: 'Optical sensors boosted. Sight expanded.',
    log_potion: 'Repair protocols initiated. Health stabilized.',
    booting: 'BOOTING_CAVERN_OS...'
  },
  CN: {
    status: '状态',
    controls: '控制',
    log: '日志',
    floor: '楼层:',
    sight: '视力:',
    key: '钥匙:',
    vitality: '生命值',
    found: '已检测到',
    missing: '未发现',
    move_n: '向北移动',
    move_w: '向西移动',
    move_s: '向南移动',
    move_e: '向东移动',
    wait: '原地待命',
    despair: '绝望',
    signal_lost: '信号丢失于地层_',
    reboot: '灵魂重启',
    log_descend: '进入导管。下降至地层 ',
    log_locked: '导管已锁定。需要终端钥匙。',
    log_hit: '正在消除威胁：-',
    log_kill: '威胁已消除。',
    log_death: '核心失效。系统离线。',
    log_hurt: '警告：完整性受损。-',
    log_key: '获得终端钥匙。',
    log_light: '光学传感器增强。视野扩大。',
    log_potion: '修复协议启动。生命体征稳定。',
    booting: '正在引导地穴系统...'
  }
};
