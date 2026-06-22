
import React from 'react';
import { LogEntry, Entity, Language } from '../types';
import { GOTHIC_BORDERS, TRANSLATIONS } from '../constants';

interface SidebarProps {
  player: Entity;
  floor: number;
  hasKey: boolean;
  visionRadius: number;
  logs: LogEntry[];
  language: Language;
  onToggleLanguage: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  player, floor, hasKey, visionRadius, logs, language, onToggleLanguage 
}) => {
  const t = TRANSLATIONS[language];
  const hpPercent = Math.max(0, (player.hp || 0) / (player.maxHp || 1) * 100);
  const barWidth = 20;
  const filledWidth = Math.round((hpPercent / 100) * barWidth);
  const hpBar = `[${'\u2588'.repeat(filledWidth)}${'.'.repeat(barWidth - filledWidth)}]`;

  // Centering logic using flex borders for pixel-perfect alignment
  const renderSectionHeader = (title: string) => {
    // For CN, use the classic coding font (SimSun/NSimSun)
    // For EN, use the decorative Gothic header font
    const headerFontClass = language === 'CN' 
      ? "font-['SimSun','NSimSun','STSong','serif'] font-bold" 
      : "gothic-header font-bold";

    return (
      <div className="mb-3 flex items-center text-gray-600">
        <div className="flex-1 border-t border-gray-800 opacity-40"></div>
        <span className={`px-4 text-gray-400 whitespace-nowrap tracking-[0.2em] ${headerFontClass}`}>
          {title}
        </span>
        <div className="flex-1 border-t border-gray-800 opacity-40"></div>
      </div>
    );
  };

  // Main terminal font logic
  const terminalFontClass = language === 'CN' 
    ? "font-['Courier_Prime','SimSun','STSong','serif']" 
    : "font-mono";

  return (
    <div className={`w-full h-full border-l border-gray-800 p-3 flex flex-col bg-black overflow-hidden text-[12px] selection:bg-gray-800 ${terminalFontClass}`}>
      {/* Top Border Decor */}
      <div className="text-gray-900 leading-none mb-4 opacity-50 flex justify-center">
        {GOTHIC_BORDERS.horizontal.repeat(35)}
      </div>

      {/* Stats Section */}
      <div className="mb-6">
        {renderSectionHeader(t.status)}
        <div className="px-2 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-tighter">{t.floor}</span>
            <span className="text-white brightness-125">{floor.toString().padStart(3, '0')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-tighter">{t.sight}</span>
            <span className={visionRadius > 2 ? 'text-yellow-700' : 'text-gray-600'}>
              {visionRadius.toFixed(1)}u
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase tracking-tighter">{t.key}</span>
            <span className={hasKey ? 'text-yellow-600 font-bold' : 'text-gray-800'}>
              {hasKey ? t.found : t.missing}
            </span>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-gray-600 font-bold uppercase">{t.vitality}</span>
              <span className="text-gray-400">{player.hp}/{player.maxHp}</span>
            </div>
            <div className={`font-bold tracking-tighter text-sm ${hpPercent < 30 ? 'text-red-900' : 'text-green-900'}`}>
              {hpBar}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="mb-6">
        {renderSectionHeader(t.controls)}
        <div className="px-2 text-[11px] text-gray-500 space-y-1.5 leading-tight">
          <p className="flex justify-between"><span>{t.move_n}</span> <span className="text-gray-400">[W / {'\u2191'}]</span></p>
          <p className="flex justify-between"><span>{t.move_w}</span> <span className="text-gray-400">[A / {'\u2190'}]</span></p>
          <p className="flex justify-between"><span>{t.move_s}</span> <span className="text-gray-400">[S / {'\u2193'}]</span></p>
          <p className="flex justify-between"><span>{t.move_e}</span> <span className="text-gray-400">[D / {'\u2192'}]</span></p>
          <p className="flex justify-between"><span>{t.wait}</span> <span className="text-gray-400">[SPACE]</span></p>
        </div>
      </div>

      {/* Log Section */}
      <div className="flex-1 flex flex-col min-h-0">
        {renderSectionHeader(t.log)}
        <div className="flex-1 overflow-y-auto space-y-1.5 px-1 text-[11px] scrollbar-hide">
          {logs.slice().reverse().map((log, i) => (
            <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-right-1 duration-200">
              <span className="text-gray-800 shrink-0 select-none font-bold">{'\u00bb'}</span>
              <span className={
                log.type === 'combat' ? 'text-red-900/90' :
                log.type === 'item' ? 'text-yellow-800/90' :
                log.type === 'danger' ? 'text-red-700 font-bold italic' :
                'text-gray-600'
              }>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Language Toggle & Footer */}
      <div className="mt-4 pt-4 border-t border-gray-900 text-center">
        <button 
          onClick={onToggleLanguage}
          className="mb-4 text-[10px] text-gray-600 hover:text-white transition-colors border border-gray-800 px-3 py-1 bg-black hover:bg-gray-950 tracking-widest uppercase"
        >
          {language === 'EN' ? '[ EN | 中 ]' : '[ 中 | EN ]'}
        </button>
        <div className="text-[10px] text-gray-800 tracking-[0.3em] mb-1 gothic-header opacity-50">
          KERNEL.SYSTEM.CAVERN
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
