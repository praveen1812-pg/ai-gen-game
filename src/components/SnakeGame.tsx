import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, TICK_RATE } from '../constants';
import { RefreshCw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const getRandomPoint = (exclude: Point[] = []): Point => {
  let newPoint: Point;
  do {
    newPoint = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (exclude.some(p => p.x === newPoint.x && p.y === newPoint.y));
  return newPoint;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directionRef = useRef<Direction>(Direction.UP);
  const gameLoopRef = useRef<number | null>(null);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    const initialFood = getRandomPoint([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setFood(initialFood);
    setDirection(Direction.UP);
    directionRef.current = Direction.UP;
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(getRandomPoint(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, score, highScore]);

  // Handle Keydown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (direction !== Direction.DOWN) { setDirection(Direction.UP); directionRef.current = Direction.UP; } break;
        case 'arrowdown':
        case 's':
          if (direction !== Direction.UP) { setDirection(Direction.DOWN); directionRef.current = Direction.DOWN; } break;
        case 'arrowleft':
        case 'a':
          if (direction !== Direction.RIGHT) { setDirection(Direction.LEFT); directionRef.current = Direction.LEFT; } break;
        case 'arrowright':
        case 'd':
          if (direction !== Direction.LEFT) { setDirection(Direction.RIGHT); directionRef.current = Direction.RIGHT; } break;
        case ' ':
          e.preventDefault();
          setIsPaused(p => !p); 
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Game loop
  useEffect(() => {
    const tick = () => {
      moveSnake();
      gameLoopRef.current = window.setTimeout(tick, Math.max(80, TICK_RATE - Math.floor(score / 50) * 10));
    };

    tick();
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [moveSnake, score]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#050208';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
      } else {
        ctx.fillStyle = index % 2 === 0 ? '#00ffff' : '#ff00ff';
        ctx.shadowBlur = 0;
      }
      
      const padding = index === 0 ? 0 : 2;
      ctx.fillRect(
        segment.x * cellSize + padding, 
        segment.y * cellSize + padding, 
        cellSize - padding * 2, 
        cellSize - padding * 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize, 
      food.y * cellSize, 
      cellSize, 
      cellSize
    );

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative group">
      {/* Game Header/Stats */}
      <div className="absolute -top-16 left-0 right-0 flex justify-between items-end px-1 z-20 font-display">
        <div>
          <div className="text-[8px] uppercase tracking-[0.2em] text-glitch-magenta font-bold italic mb-1">DATA_HARVEST</div>
          <div className="text-3xl font-bold text-glitch-cyan glitch-text">
            {score.toString().padStart(5, '0')}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">PEAK_BUFFER</div>
          <div className="text-lg font-bold text-glitch-magenta italic">
            {highScore.toString().padStart(5, '0')}
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="relative p-1 bg-black terminal-border">
        <canvas 
          ref={canvasRef} 
          width={460} 
          height={460} 
          className="block bg-black"
        />
        
        <div className="absolute inset-0 pointer-events-none noise-overlay opacity-20 z-10" />
        <div className="absolute inset-0 pointer-events-none z-20 animate-scan-distort opacity-10 bg-glitch-cyan/5" />

        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-30 font-display p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-glitch-magenta glitch-text mb-2 tracking-tighter uppercase">SYSTEM_FATAL_ERROR</h2>
              <p className="text-white/40 mb-10 font-mono text-[8px] tracking-[0.3em] uppercase underline decoration-glitch-cyan">Neural Link Severed at {score} Bits</p>
              
              <button 
                onClick={resetGame}
                className="group flex flex-col items-center gap-6 transition-all"
              >
                <div className="w-16 h-16 bg-glitch-magenta flex items-center justify-center shadow-[4px_4px_0_var(--color-glitch-cyan)] group-hover:bg-white transition-colors animate-glitch">
                  <RefreshCw className="w-8 h-8 text-black" />
                </div>
                <span className="text-[9px] font-mono font-bold text-glitch-cyan tracking-[0.4em] uppercase">INIT_REBOOT_SEQUENCE</span>
              </button>
            </motion.div>
          )}

          {!isGameOver && isPaused && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30 cursor-pointer backdrop-grayscale"
              onClick={() => setIsPaused(false)}
            >
              <div className="w-16 h-16 border-2 border-glitch-cyan flex items-center justify-center bg-black shadow-[4px_4px_0_var(--color-glitch-magenta)]">
                <Play className="w-6 h-6 text-glitch-cyan fill-current" />
              </div>
              <p className="mt-4 font-display text-[9px] text-glitch-cyan uppercase tracking-[0.4em] glitch-text">PROCESS_HALTED</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Help Overlay */}
      <div className="absolute -bottom-14 left-0 right-0 flex justify-between px-1 z-20 font-mono italic">
        <div className="flex items-center gap-4 text-glitch-cyan/60 group">
          <div className="flex gap-1">
            <kbd className="px-1 bg-glitch-cyan text-black text-[9px] font-bold">W</kbd>
            <kbd className="px-1 bg-glitch-cyan text-black text-[9px] font-bold">A</kbd>
            <kbd className="px-1 bg-glitch-cyan text-black text-[9px] font-bold">S</kbd>
            <kbd className="px-1 bg-glitch-cyan text-black text-[9px] font-bold">D</kbd>
          </div>
          <span className="text-[8px] uppercase tracking-widest font-bold">NAV_MATRIX</span>
        </div>
        <div className="flex items-center gap-3 text-glitch-magenta/60">
          <kbd className="px-2 bg-glitch-magenta text-black text-[9px] font-bold uppercase">SPACE</kbd>
          <span className="text-[8px] uppercase tracking-widest font-bold">SUSPEND</span>
        </div>
      </div>
    </div>
  );
}
