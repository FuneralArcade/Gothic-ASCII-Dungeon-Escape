
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TileType, Position, Entity, LogEntry, GameState, Language } from './types';
import { MAP_WIDTH, MAP_HEIGHT, INITIAL_HP, INITIAL_VISION, UPGRADED_VISION, TILE_COLORS, TRANSLATIONS } from './constants';
import { MapGenerator } from './services/MapGenerator';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [language, setLanguage] = useState<Language>('EN');
  const gameRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        logs: [...prev.logs, { timestamp, message: message.toUpperCase(), type }]
      };
    });
  }, []);

  const initLevel = useCallback((floorNum: number, currentHp?: number, currentMaxHp?: number) => {
    const map = MapGenerator.generate(MAP_WIDTH, MAP_HEIGHT, floorNum);
    const explored = Array(MAP_HEIGHT).fill(null).map(() => Array(MAP_WIDTH).fill(false));
    const visited = Array(MAP_HEIGHT).fill(null).map(() => Array(MAP_WIDTH).fill(false));
    
    const playerPos = MapGenerator.getValidSpawn(map);
    visited[playerPos.y][playerPos.x] = true;

    const entities: Entity[] = [];

    // Spawn Lantern
    const lanternPos = MapGenerator.getValidSpawn(map);
    entities.push({ id: 'lantern', type: TileType.LANTERN, pos: lanternPos });

    // Spawn Key
    const keyPos = MapGenerator.getValidSpawn(map);
    entities.push({ id: 'key', type: TileType.KEY, pos: keyPos });

    // Spawn Exit
    const exitPos = MapGenerator.getValidSpawn(map);
    map[exitPos.y][exitPos.x] = TileType.DOOR;

    // Spawn Potions
    const potionCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < potionCount; i++) {
      entities.push({ id: `p-${i}`, type: TileType.POTION, pos: MapGenerator.getValidSpawn(map) });
    }

    // Spawn Enemies
    const enemyCount = 3 + floorNum * 2;
    for (let i = 0; i < enemyCount; i++) {
      entities.push({ 
        id: `e-${i}`, 
        type: TileType.ENEMY, 
        pos: MapGenerator.getValidSpawn(map),
        hp: 10 + floorNum * 5,
        maxHp: 10 + floorNum * 5
      });
    }

    const newState: GameState = {
      player: { 
        id: 'player', 
        type: TileType.PLAYER, 
        pos: playerPos, 
        hp: currentHp ?? INITIAL_HP, 
        maxHp: currentMaxHp ?? INITIAL_HP 
      },
      entities,
      map,
      explored,
      visited,
      visionRadius: INITIAL_VISION,
      hasKey: false,
      floor: floorNum,
      logs: [],
      language: 'EN'
    };

    setGameState(newState);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initLevel(1);
  }, [initLevel]);

  const updateVisibility = useCallback(() => {
    if (!gameState) return;
    const { player, visionRadius, explored, visited } = gameState;
    const newExplored = explored.map(row => [...row]);
    const newVisited = visited.map(row => [...row]);

    newVisited[player.pos.y][player.pos.x] = true;

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const dist = Math.sqrt(Math.pow(x - player.pos.x, 2) + Math.pow(y - player.pos.y, 2));
        if (dist <= visionRadius) {
          newExplored[y][x] = true;
        }
      }
    }

    setGameState(prev => prev ? ({ ...prev, explored: newExplored, visited: newVisited }) : null);
  }, [gameState?.player.pos.x, gameState?.player.pos.y, gameState?.visionRadius]);

  useEffect(() => {
    updateVisibility();
  }, [gameState?.player.pos]);

  // Handle enemy turns
  const processEnemyTurns = (currentState: GameState) => {
    let currentHp = currentState.player.hp!;
    const playerPos = currentState.player.pos;
    let isDead = false;

    const updatedEntities = currentState.entities.map(entity => {
      if (entity.type !== TileType.ENEMY) return entity;

      const dist = Math.abs(entity.pos.x - playerPos.x) + Math.abs(entity.pos.y - playerPos.y);
      
      // Enemy only acts if player is within range (e.g., detected)
      if (dist < 8) {
        let nextX = entity.pos.x;
        let nextY = entity.pos.y;

        if (entity.pos.x < playerPos.x) nextX++;
        else if (entity.pos.x > playerPos.x) nextX--;
        else if (entity.pos.y < playerPos.y) nextY++;
        else if (entity.pos.y > playerPos.y) nextY--;

        // Collision with walls/rocks
        if (currentState.map[nextY][nextX] === TileType.WALL || currentState.map[nextY][nextX] === TileType.ROCK) {
          return entity;
        }

        // Check if hitting player
        if (nextX === playerPos.x && nextY === playerPos.y) {
          const dmg = 5 + Math.floor(Math.random() * 8);
          currentHp -= dmg;
          addLog(`${language === 'CN' ? '敌人攻击你：-' : 'Enemy strikes: -'}${dmg} HP.`, 'combat');
          if (currentHp <= 0) isDead = true;
          return entity; // Enemy stays where they are and attacks
        }

        // Check collision with other entities
        const otherEntity = currentState.entities.find(e => e.id !== entity.id && e.pos.x === nextX && e.pos.y === nextY);
        if (otherEntity) return entity;

        return { ...entity, pos: { x: nextX, y: nextY } };
      }

      return entity;
    });

    if (isDead) setGameOver(true);

    setGameState(prev => prev ? ({
      ...prev,
      player: { ...prev.player, hp: Math.max(0, currentHp) },
      entities: updatedEntities
    }) : null);
  };

  const handleMove = (dx: number, dy: number) => {
    if (!gameState || gameOver) return;

    // Wait logic
    if (dx === 0 && dy === 0) {
      addLog(t.wait, 'info');
      processEnemyTurns(gameState);
      return;
    }

    const newX = gameState.player.pos.x + dx;
    const newY = gameState.player.pos.y + dy;

    if (newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) return;

    const targetTile = gameState.map[newY][newX];
    if (targetTile === TileType.WALL || targetTile === TileType.ROCK) return;

    if (targetTile === TileType.DOOR) {
      if (gameState.hasKey) {
        addLog(`${t.log_descend}${gameState.floor + 1}.`, 'info');
        initLevel(gameState.floor + 1, gameState.player.hp, gameState.player.maxHp);
        return;
      } else {
        addLog(t.log_locked, 'danger');
        return;
      }
    }

    const entityAtTarget = gameState.entities.find(e => e.pos.x === newX && e.pos.y === newY);
    let actionTaken = false;
    
    if (entityAtTarget) {
      if (entityAtTarget.type === TileType.ENEMY) {
        actionTaken = true;
        const damage = 10 + Math.floor(Math.random() * 10);
        addLog(`${t.log_hit}${damage} HP.`, 'combat');
        
        setGameState(prev => {
          if (!prev) return null;
          const updatedEntities = prev.entities.map(e => {
            if (e.id === entityAtTarget.id) {
              return { ...e, hp: (e.hp || 0) - damage };
            }
            return e;
          }).filter(e => (e.hp !== undefined ? e.hp > 0 : true));

          if (updatedEntities.length < prev.entities.length) {
            addLog(t.log_kill, 'info');
          }

          const nextState = { ...prev, entities: updatedEntities };
          processEnemyTurns(nextState);
          return nextState;
        });
        return;
      }

      if (entityAtTarget.type === TileType.KEY) {
        addLog(t.log_key, 'item');
        setGameState(prev => prev ? ({ ...prev, hasKey: true, entities: prev.entities.filter(e => e.id !== entityAtTarget.id) }) : null);
      } else if (entityAtTarget.type === TileType.LANTERN) {
        addLog(t.log_light, 'item');
        setGameState(prev => prev ? ({ ...prev, visionRadius: UPGRADED_VISION, entities: prev.entities.filter(e => e.id !== entityAtTarget.id) }) : null);
      } else if (entityAtTarget.type === TileType.POTION) {
        addLog(t.log_potion, 'item');
        setGameState(prev => prev ? ({ ...prev, player: { ...prev.player, hp: Math.min(prev.player.maxHp!, prev.player.hp! + 25) }, entities: prev.entities.filter(e => e.id !== entityAtTarget.id) }) : null);
      }
    }

    // Move and then let enemies move
    setGameState(prev => {
      if (!prev) return null;
      const nextState = {
        ...prev,
        player: { ...prev.player, pos: { x: newX, y: newY } }
      };
      processEnemyTurns(nextState);
      return nextState;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': handleMove(0, -1); break;
        case 's': case 'arrowdown': handleMove(0, 1); break;
        case 'a': case 'arrowleft': handleMove(-1, 0); break;
        case 'd': case 'arrowright': handleMove(1, 0); break;
        case ' ': 
          e.preventDefault(); 
          handleMove(0, 0); 
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, gameOver, language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'CN' : 'EN');
  };

  if (!gameState) return <div className="h-screen w-screen flex items-center justify-center bg-black text-gray-800 gothic-header animate-pulse">{t.booting}</div>;

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden font-mono select-none">
      <div ref={gameRef} className="w-[80%] h-full flex items-center justify-center relative p-8 cursor-default">
        <div className="grid grid-cols-[repeat(60,1fr)] gap-0 text-center leading-none text-lg">
          {gameState.map.map((row, y) => (
            row.map((tile, x) => {
              const isVisible = Math.sqrt(Math.pow(x - gameState.player.pos.x, 2) + Math.pow(y - gameState.player.pos.y, 2)) <= gameState.visionRadius;
              const isExplored = gameState.explored[y][x];
              const isVisited = gameState.visited[y][x];
              let char = tile as string;
              let colorClass = TILE_COLORS[char] || 'text-gray-400';

              if (gameState.player.pos.x === x && gameState.player.pos.y === y) {
                char = TileType.PLAYER;
                colorClass = TILE_COLORS[TileType.PLAYER];
              } else if (isVisible) {
                const ent = gameState.entities.find(e => e.pos.x === x && e.pos.y === y);
                if (ent) { char = ent.type; colorClass = TILE_COLORS[ent.type]; }
              }

              if (!isVisible) {
                if (isExplored) {
                  if (isVisited && tile === TileType.FLOOR) { char = '·'; colorClass = 'text-gray-700/40'; }
                  else { colorClass = 'text-gray-900 opacity-20'; }
                } else { char = ' '; colorClass = 'text-black'; }
              }
              return <div key={`${x}-${y}`} className={`w-4 h-4 flex items-center justify-center ${colorClass} transition-colors duration-500`}>{char}</div>;
            })
          ))}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-in fade-in duration-1000">
            <h1 className="text-8xl text-red-950 font-bold mb-4 tracking-tighter gothic-title">{t.despair}</h1>
            <p className="text-gray-700 mb-8 gothic-header text-xl tracking-widest">{t.signal_lost}{gameState.floor}</p>
            <button onClick={() => initLevel(1)} className="px-12 py-3 border border-red-950 text-red-900 hover:bg-red-950 hover:text-red-500 transition-all uppercase tracking-[0.5em] gothic-header text-sm">
              {t.reboot}
            </button>
          </div>
        )}
      </div>

      <div className="w-[20%] h-full">
        <Sidebar 
          player={gameState.player} 
          floor={gameState.floor} 
          hasKey={gameState.hasKey}
          visionRadius={gameState.visionRadius}
          logs={gameState.logs}
          language={language}
          onToggleLanguage={toggleLanguage}
        />
      </div>
    </div>
  );
};

export default App;
