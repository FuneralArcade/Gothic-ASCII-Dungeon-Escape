
import React from 'react';
import { LogEntry, Entity } from '../types';
import { GOTHIC_BORDERS } from '../constants';

interface SidebarProps {
  player: Entity;
  floor: number;
  hasKey: boolean;
  visionRadius: number;
  logs: LogEntry[];
}

const Sidebar: React.FC<SidebarProps> = ({ player, floor, hasKey, visionRadius, logs }) => {
  const hpPercent = Math.max(0, (player.hp || 0) / (player.maxHp || 1) * 100);
  const barWidth = 20;
  const filledWidth = Math.round((hpPercent / 100) * barWidth);
  const hpBar = `[${'█'.repeat(filledWidth)}${'.'.repeat(barWidth - filledWidth)}]`;

  const renderSectionHeader = (title: string) => {
    const totalWidth = 30;
    const titleFull = ` ${title} `;
    const lineSide = GOTHIC_BORDERS.horizontal.repeat(Math.max(0, Math.floor((totalWidth - titleFull.length) / 2)));
    return (
      <div className="text-gray-600 font-bold mb-2 flex items-center whitespace-pre overflow-hidden gothic-header tracking-widest">
        {lineSide}<span className="text-gray-400">{titleFull}</span>{lineSide.padEnd(totalWidth - titleFull.length - lineSide.length, GOTHIC_BORDERS.horizontal)}
      </div>
    );
  };

  return (
    <div className="w-full h-full border-l border-gray-800 p-2 flex flex-col bg-black overflow-hidden font-mono text-[12px] selection:bg-gray-800">
      {/* Top Border */}
      <div className="text-gray-900 leading-none mb-4 opacity-50">
        {GOTHIC_BORDERS.horizontal.repeat(40)}
      </div>

      {/* Stats Section */}
      <div className="mb-6">
        {renderSectionHeader('STATUS')}
        <div className="px-2 space-y-1 font-mono">
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-tighter">Floor_Level:</span>
            <span className="text-white brightness-125">{floor.toString().padStart(3, '0')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-tighter">Sight_Range:</span>
            <span className={visionRadius > 2 ? 'text-yellow-700' : 'text-gray-600'}>
              {visionRadius.toFixed(1)}u
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-tighter">Relic_Key:</span>
            <span className={hasKey ? 'text-yellow-600 font-bold' : 'text-gray-800'}>
              {hasKey ? 'DETECTED' : 'NOT_FOUND'}
            </span>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-gray-600 font-bold">VITALITY_CORE</span>
              <span className="text-gray-400">{player.hp}/{player.maxHp}</span>
            </div>
            <div className={`font-bold tracking-tighter ${hpPercent < 30 ? 'text-red-900' : 'text-green-950'}`}>
              {hpBar}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="mb-6">
        {renderSectionHeader('CONTROLS')}
        <div className="px-2 text-[10px] text-gray-500 space-y-1 font-mono leading-tight">
          <p className="flex justify-between"><span>MOVE_NORTH</span> <span className="text-gray-400">[W / UP]</span></p>
          <p className="flex justify-between"><span>MOVE_WEST</span> <span className="text-gray-400">[A / LFT]</span></p>
          <p className="flex justify-between"><span>MOVE_SOUTH</span> <span className="text-gray-400">[S / DWN]</span></p>
          <p className="flex justify-between"><span>MOVE_EAST</span> <span className="text-gray-400">[D / RGT]</span></p>
          <p className="flex justify-between"><span>STAY_IDLE</span> <span className="text-gray-400">[SPACE]</span></p>
        </div>
      </div>

      {/* Log Section */}
      <div className="flex-1 flex flex-col min-h-0">
        {renderSectionHeader('LOG')}
        <div className="flex-1 overflow-y-auto space-y-1 px-1 text-[11px] scrollbar-hide font-mono">
          {logs.slice().reverse().map((log, i) => (
            <div key={i} className="flex gap-1 animate-in fade-in slide-in-from-right-1 duration-200">
              <span className="text-gray-800 shrink-0 select-none">#</span>
              <span className={
                log.type === 'combat' ? 'text-red-900/90' :
                log.type === 'item' ? 'text-yellow-800/90' :
                log.type === 'danger' ? 'text-red-700 font-bold italic' :
                'text-gray-600'
              }>
                {log.message.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-4 pt-2 border-t border-gray-900 text-center">
        <div className="text-[10px] text-gray-800 tracking-[0.2em] mb-1 gothic-header">
          KERNEL.SYSTEM.CAVERN
        </div>
        <div className="text-[9px] text-gray-900 opacity-30">
          {GOTHIC_BORDERS.bottomLeft}{GOTHIC_BORDERS.horizontal.repeat(20)}{GOTHIC_BORDERS.bottomRight}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
