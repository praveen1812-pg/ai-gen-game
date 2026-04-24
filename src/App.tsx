import { useState, useRef, useEffect, useCallback } from 'react';
import SnakeGame from './components/SnakeGame';
import { DUMMY_TRACKS } from './constants';
import { Track } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  Music, User, Zap, Activity, Gamepad2, 
  Trophy, ChevronRight
} from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  }, []);

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-screen bg-bg-terminal text-glitch-cyan flex flex-col font-mono overflow-hidden relative selection:bg-glitch-magenta selection:text-black">
      <div className="absolute inset-0 noise-overlay z-50 pointer-events-none" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* SYSTEM HEADER */}
      <header className="h-14 border-b-2 border-glitch-cyan flex items-center justify-between px-6 bg-black shrink-0 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-6 h-6 bg-glitch-cyan shadow-[2px_2px_0_var(--color-glitch-magenta)] flex items-center justify-center">
            <Cpu className="w-4 h-4 text-black" />
          </div>
          <h1 className="text-lg font-display font-bold tracking-tighter glitch-text uppercase">
            NEURAL_LINK <span className="text-glitch-magenta opacity-80 ml-1">v4.0.1</span>
          </h1>
        </div>
        
        <div className="flex gap-6 items-center font-mono text-[10px] tracking-widest text-glitch-cyan/60">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">●</span>
            <span>UPLINK_STABLE</span>
          </div>
          <div className="flex items-center gap-4">
            <Activity className="w-3 h-3 text-glitch-magenta animate-glitch" />
            <span className="hidden sm:inline">CYCLE_RATE: 0.15ms</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* DATA ARCHIVE / PLAYLIST */}
        <aside className="w-64 bg-black border-r-2 border-glitch-cyan p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-glitch-magenta italic tracking-[0.2em] mb-2 px-1">DATA_STRIATE</h3>
            <div className="space-y-1">
              {DUMMY_TRACKS.map((track, i) => (
                <button 
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(i);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left p-2 flex items-center gap-3 transition-all border ${
                    currentTrackIndex === i 
                    ? 'bg-glitch-cyan/10 border-glitch-cyan' 
                    : 'border-transparent hover:bg-white/5 opacity-60'
                  }`}
                >
                  <div className="w-8 h-8 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden">
                    <img src={track.cover} className={`w-full h-full object-cover ${currentTrackIndex === i ? 'grayscale-0' : 'grayscale'}`} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-bold truncate leading-none mb-1">{track.title}</div>
                    <div className="text-[8px] opacity-50 truncate uppercase">{track.artist}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-white/10 italic">
            <div className="p-3 border-2 border-glitch-magenta bg-glitch-magenta/5">
              <div className="text-[9px] text-glitch-magenta font-bold mb-1 uppercase">Directive_7</div>
              <p className="text-[8px] text-white/40 leading-tight">INFILTRATE LOCAL BUFFER. HARVEST BIOMASS. IGNORE THE NOISE.</p>
            </div>
          </div>
        </aside>

        {/* EXECUTION GRID */}
        <section className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(var(--color-glitch-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-glitch-cyan) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <SnakeGame />
        </section>

        {/* FEEDBACK LOOP */}
        <aside className="w-56 border-l-2 border-glitch-cyan p-4 bg-black shrink-0 overflow-y-auto hidden lg:flex flex-col gap-4 italic">
          <div className="flex items-center gap-2 mb-2 text-glitch-magenta">
            <Zap className="w-3 h-3" />
            <h3 className="text-[10px] uppercase font-bold tracking-widest">RANK_NODE</h3>
          </div>
          <div className="space-y-3 font-mono text-[10px]">
            {[
              { id: '0X01', user: 'NULL_VOID', score: '84K' },
              { id: '0X02', user: 'BIT_DRAIN', score: '72K' },
              { id: '0X03', user: 'SYS_ADMIN', score: '61K' },
              { id: '0X04', user: 'VOID_WALK', score: '55K' }
            ].map(entry => (
              <div key={entry.id} className="flex flex-col border-b border-white/5 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-glitch-magenta">{entry.id}</span>
                  <span className="text-white/30">{entry.score}</span>
                </div>
                <div className="text-white font-bold tracking-widest truncate">{entry.user}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-glitch-cyan/20 p-2 text-center animate-scan-distort">
            <p className="text-[8px] text-glitch-cyan/40 uppercase leading-none">Scanning Neural Channels...</p>
          </div>
        </aside>
      </main>

      {/* AUDIO OUTPUT INTERFACE */}
      <footer className="h-20 bg-black border-t-2 border-glitch-cyan flex items-center px-6 gap-8 shrink-0 relative z-20">
        <div className="flex items-center gap-4 w-56 shrink-0">
          <div className="w-10 h-10 border-2 border-glitch-magenta shrink-0 p-0.5">
            <img src={currentTrack.cover} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-white truncate uppercase tracking-widest mb-1">{currentTrack.title}</div>
            <div className="text-[8px] text-glitch-magenta uppercase truncate">{currentTrack.artist}</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2 items-center">
          <div className="flex items-center gap-12">
            <button onClick={handlePrev} className="text-glitch-cyan/60 hover:text-glitch-cyan transition-colors">
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-glitch-cyan text-black flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-[4px_4px_0_var(--color-glitch-magenta)]"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button onClick={handleNext} className="text-glitch-cyan/60 hover:text-glitch-cyan transition-colors">
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>
          <div className="w-full max-w-lg flex items-center gap-3">
            <span className="text-[8px] text-glitch-magenta w-8 text-right font-bold">{formatTime(audioRef.current?.currentTime || 0)}</span>
            <div className="flex-1 h-3 border border-glitch-cyan relative overflow-hidden bg-white/5">
              <div 
                className="absolute inset-y-0 left-0 bg-glitch-cyan/40 border-r-2 border-glitch-cyan"
                style={{ width: `${progress}%` }}
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress || 0} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
            <span className="text-[8px] text-glitch-cyan w-8 font-bold">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="w-56 flex justify-end items-center gap-4 shrink-0">
          <Volume2 className="w-4 h-4 text-glitch-cyan/40" />
          <div className="w-20 h-1.5 bg-zinc-900 border border-white/10 relative">
            <div className="absolute inset-y-0 left-0 bg-glitch-magenta/60" style={{ width: `${volume * 100}%` }} />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
