
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TileType, Position, Entity, LogEntry, GameState, Language } from './types';
import { MAP_WIDTH, MAP_HEIGHT, INITIAL_HP, INITIAL_VISION, UPGRADED_VISION, FINAL_FLOOR, TILE_COLORS, TRANSLATIONS } from './constants';
import { MapGenerator } from './services/MapGenerator';
import { AudioManager } from './services/AudioManager';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
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
    const occupied: Position[] = [playerPos];

    // Spawn Lantern - at least 4 tiles away from player
    const lanternPos = MapGenerator.getValidSpawnFar(map, [{ pos: playerPos, minDist: 4 }], occupied);
    entities.push({ id: 'lantern', type: TileType.LANTERN, pos: lanternPos });
    occupied.push(lanternPos);

    // Spawn Key - at least 5 tiles away from player
    const keyPos = MapGenerator.getValidSpawnFar(map, [{ pos: playerPos, minDist: 5 }], occupied);
    entities.push({ id: 'key', type: TileType.KEY, pos: keyPos });
    occupied.push(keyPos);

    // Spawn Exit - at least 6 tiles away from player and 4 tiles away from key
    const exitPos = MapGenerator.getValidSpawnFar(
      map, 
      [
        { pos: playerPos, minDist: 6 },
        { pos: keyPos, minDist: 4 }
      ], 
      occupied
    );
    map[exitPos.y][exitPos.x] = TileType.DOOR;
    occupied.push(exitPos);

    // Spawn Potions - avoid player close surroundings
    const potionCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < potionCount; i++) {
      const pos = MapGenerator.getValidSpawnFar(map, [{ pos: playerPos, minDist: 3 }], occupied);
      entities.push({ id: `p-${i}`, type: TileType.POTION, pos });
      occupied.push(pos);
    }

    // Spawn Enemies - AT LEAST 6 tiles away from player to prevent immediate agro, and reduced count
    const enemyCount = 2 + floorNum;
    for (let i = 0; i < enemyCount; i++) {
      const pos = MapGenerator.getValidSpawnFar(map, [{ pos: playerPos, minDist: 6 }], occupied);
      entities.push({ 
        id: `e-${i}`, 
        type: TileType.ENEMY, 
        pos,
        hp: 10 + floorNum * 5,
        maxHp: 10 + floorNum * 5
      });
      occupied.push(pos);
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
    setVictory(false);
  }, []);

  useEffect(() => {
    initLevel(1);
  }, [initLevel]);

  // Periodic chilling wind
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // Slightly more frequent wind
        AudioManager.playWind();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const processEnemyTurnsOnState = (currentState: GameState, logsList: LogEntry[]): GameState => {
    let currentHp = currentState.player.hp!;
    const playerPos = currentState.player.pos;
    let isDead = false;
    let hurtSoundPlayed = false;

    const helperAddLog = (msg: string, type: LogEntry['type'] = 'info') => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      logsList.push({ timestamp, message: msg.toUpperCase(), type });
    };

    const updatedEntities = currentState.entities.map(entity => {
      if (entity.type !== TileType.ENEMY) return entity;

      const dist = Math.abs(entity.pos.x - playerPos.x) + Math.abs(entity.pos.y - playerPos.y);
      
      if (dist < 5) {
        let nextX = entity.pos.x;
        let nextY = entity.pos.y;

        if (entity.pos.x < playerPos.x) nextX++;
        else if (entity.pos.x > playerPos.x) nextX--;
        else if (entity.pos.y < playerPos.y) nextY++;
        else if (entity.pos.y > playerPos.y) nextY--;

        if (nextX < 0 || nextX >= MAP_WIDTH || nextY < 0 || nextY >= MAP_HEIGHT) {
          return entity;
        }

        if (currentState.map[nextY][nextX] === TileType.WALL || currentState.map[nextY][nextX] === TileType.ROCK) {
          return entity;
        }

        if (nextX === playerPos.x && nextY === playerPos.y) {
          const dmg = 5 + Math.floor(Math.random() * 8);
          currentHp -= dmg;
          helperAddLog(`${t.log_hurt}${dmg} HP.`, 'combat');
          
          if (!hurtSoundPlayed) {
            AudioManager.playHurt();
            hurtSoundPlayed = true;
          }
          
          if (currentHp <= 0) isDead = true;
          return entity;
        }

        const otherEntity = currentState.entities.find(e => e.id !== entity.id && e.pos.x === nextX && e.pos.y === nextY);
        if (otherEntity) return entity;

        return { ...entity, pos: { x: nextX, y: nextY } };
      }

      // If outside aggro range, move randomly with 20% probability or idle
      if (Math.random() < 0.2) {
        const dirs = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 }
        ];
        const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
        const nextX = entity.pos.x + randomDir.dx;
        const nextY = entity.pos.y + randomDir.dy;

        if (nextX >= 0 && nextX < MAP_WIDTH && nextY >= 0 && nextY < MAP_HEIGHT) {
          if (currentState.map[nextY][nextX] === TileType.FLOOR) {
            const occupied = currentState.entities.some(e => e.id !== entity.id && e.pos.x === nextX && e.pos.y === nextY);
            const isPlayer = nextX === playerPos.x && nextY === playerPos.y;
            if (!occupied && !isPlayer) {
              return { ...entity, pos: { x: nextX, y: nextY } };
            }
          }
        }
      }

      return entity;
    });

    if (isDead) {
      AudioManager.playGameOver();
      setGameOver(true);
    }

    return {
      ...currentState,
      player: { ...currentState.player, hp: Math.max(0, currentHp) },
      entities: updatedEntities,
      logs: logsList
    };
  };

  const handleMove = (dx: number, dy: number) => {
    if (!gameState || gameOver || victory) return;
    
    AudioManager.resume();

    const t = TRANSLATIONS[language];

    // 1. Check wait action
    if (dx === 0 && dy === 0) {
      const nextState = { ...gameState };
      const nextLogs = [...gameState.logs];
      
      const helperAddLog = (msg: string, type: LogEntry['type'] = 'info') => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        nextLogs.push({ timestamp, message: msg.toUpperCase(), type });
      };

      helperAddLog(t.wait, 'info');
      AudioManager.playFootstep();

      const finalState = processEnemyTurnsOnState(nextState, nextLogs);
      setGameState(finalState);
      return;
    }

    const newX = gameState.player.pos.x + dx;
    const newY = gameState.player.pos.y + dy;

    if (newX < 0 || newX >= MAP_WIDTH || newY < 0 || newY >= MAP_HEIGHT) return;

    const targetTile = gameState.map[newY][newX];
    if (targetTile === TileType.WALL || targetTile === TileType.ROCK) return;

    const nextState = {
      ...gameState,
      player: { ...gameState.player },
      entities: gameState.entities.map(e => ({ ...e })),
      logs: [...gameState.logs]
    };

    const helperAddLog = (msg: string, type: LogEntry['type'] = 'info') => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      nextState.logs.push({ timestamp, message: msg.toUpperCase(), type });
    };

    // Check stairs/door
    if (targetTile === TileType.DOOR) {
      if (gameState.hasKey) {
        if (gameState.floor === FINAL_FLOOR) {
          AudioManager.playVictory();
          setVictory(true);
          return;
        } else {
          AudioManager.playDescend();
          addLog(`${t.log_descend}${gameState.floor + 1}.`, 'info');
          initLevel(gameState.floor + 1, gameState.player.hp, gameState.player.maxHp);
          return;
        }
      } else {
        AudioManager.playFootstep(); // Rattling lock sound
        addLog(t.log_locked, 'danger');
        return;
      }
    }

    let soundToPlay: 'footstep' | 'pickup_key' | 'pickup_lantern' | 'potion' | 'hit' | null = 'footstep';
    const entityAtTargetIndex = nextState.entities.findIndex(e => e.pos.x === newX && e.pos.y === newY);

    if (entityAtTargetIndex !== -1) {
      const ent = nextState.entities[entityAtTargetIndex];
      
      if (ent.type === TileType.ENEMY) {
        const damage = 10 + Math.floor(Math.random() * 10);
        helperAddLog(`${t.log_hit}${damage} HP.`, 'combat');
        soundToPlay = 'hit';

        ent.hp = (ent.hp ?? 0) - damage;
        if (ent.hp <= 0) {
          helperAddLog(t.log_kill, 'info');
          nextState.entities.splice(entityAtTargetIndex, 1);
        }
      } else {
        if (ent.type === TileType.KEY) {
          helperAddLog(t.log_key, 'item');
          soundToPlay = 'pickup_key';
          nextState.hasKey = true;
        } else if (ent.type === TileType.LANTERN) {
          helperAddLog(t.log_light, 'item');
          soundToPlay = 'pickup_lantern';
          nextState.visionRadius = UPGRADED_VISION;
        } else if (ent.type === TileType.POTION) {
          helperAddLog(t.log_potion, 'item');
          soundToPlay = 'potion';
          nextState.player.hp = Math.min(nextState.player.maxHp!, (nextState.player.hp ?? 0) + 25);
        }

        nextState.entities.splice(entityAtTargetIndex, 1);
        nextState.player.pos = { x: newX, y: newY };
      }
    } else {
      nextState.player.pos = { x: newX, y: newY };
    }

    if (soundToPlay === 'footstep') AudioManager.playFootstep();
    else if (soundToPlay === 'pickup_key') AudioManager.playPickupKey();
    else if (soundToPlay === 'pickup_lantern') AudioManager.playPickupLantern();
    else if (soundToPlay === 'potion') AudioManager.playPotion();
    else if (soundToPlay === 'hit') AudioManager.playHit();

    const finalState = processEnemyTurnsOnState(nextState, nextState.logs);
    setGameState(finalState);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || victory) return;
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
  }, [gameState, gameOver, victory, language]);

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
            <p className="text-gray-700 mb-8 gothic-header text-xl tracking-widest">{t.signal_lost.replace('{floor}', String(gameState.floor))}</p>
            <button onClick={() => initLevel(1)} className="px-12 py-3 border border-red-950 text-red-900 hover:bg-red-950 hover:text-red-500 transition-all uppercase tracking-[0.5em] gothic-header text-sm">
              {t.reboot}
            </button>
          </div>
        )}

        {victory && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-50 animate-in fade-in duration-1000">
            <h1 className="text-8xl text-yellow-600 font-bold mb-4 tracking-tighter gothic-title animate-pulse">{t.victory}</h1>
            <p className="text-gray-300 mb-2 gothic-header text-2xl tracking-widest text-center">{t.victory_desc}</p>
            <p className="text-gray-600 mb-8 font-mono text-sm tracking-widest text-center">
              {t.victory_sub}{gameState.floor}
            </p>
            <button onClick={() => { initLevel(1); }} className="px-12 py-3 border border-yellow-700 text-yellow-600 hover:bg-yellow-950/40 hover:text-yellow-400 transition-all uppercase tracking-[0.5em] gothic-header text-sm">
              {t.victory_btn}
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
