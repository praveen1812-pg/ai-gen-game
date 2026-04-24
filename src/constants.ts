import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE_LENGTH = 3;
export const TICK_RATE = 150; // ms per tick

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neural Pulse',
    artist: 'AI Virtuoso',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&h=200&auto=format&fit=crop',
    color: '#ff00ff', // Pink
  },
  {
    id: '2',
    title: 'Synthetic Dreams',
    artist: 'Cyberspace',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&h=200&auto=format&fit=crop',
    color: '#00ffff', // Blue
  },
  {
    id: '3',
    title: 'Bitwise Harmony',
    artist: 'Data Ghost',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&h=200&auto=format&fit=crop',
    color: '#00ff00', // Green
  },
];
