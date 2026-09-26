'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type MascotEmotion =
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'celebrating'
  | 'shocked'
  | 'confident'
  | 'sleeping'
  | 'sad'
  | 'winking'
  | 'avatar';

export type MascotSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

interface MascotAvatarProps {
  emotion?: MascotEmotion | string;
  size?: MascotSize;
  animate?: boolean;
  glow?: boolean;
  speechBubble?: string;
  isThought?: boolean;
  pointingDirection?: 'left' | 'right' | 'down' | null;
  className?: string;
  priority?: boolean;
}

const SIZE_MAP: Record<MascotSize, number> = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 160,
  hero: 220,
};

const VALID_EMOTIONS = new Set([
  'happy',
  'excited',
  'thinking',
  'celebrating',
  'shocked',
  'confident',
  'sleeping',
  'sad',
  'winking',
  'avatar',
]);

export default function MascotAvatar({
  emotion = 'happy',
  size = 'md',
  animate = true,
  glow = true,
  speechBubble,
  isThought = false,
  pointingDirection = null,
  className,
  priority = false,
}: MascotAvatarProps) {
  const normalizedEmotion = VALID_EMOTIONS.has(emotion) ? emotion : 'happy';
  const initialPath = `/mascot-${normalizedEmotion}.png`;
  const [imgSrc, setImgSrc] = useState<string>(initialPath);

  useEffect(() => {
    const valid = VALID_EMOTIONS.has(emotion) ? emotion : 'happy';
    setImgSrc(`/mascot-${valid}.png`);
  }, [emotion]);

  const pixelSize = SIZE_MAP[size] || 80;

  // Emotion-specific spring bounce variant
  const getBounceVariant = () => {
    switch (emotion) {
      case 'excited':
      case 'celebrating':
        return { y: [0, -10, 0], scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 1.2 } };
      case 'thinking':
        return { rotate: [-2, 2, -2], transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' as const } };
      default:
        return { y: [0, -5, 0], transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' as const } };
    }
  };

  return (
    <div className={cn('relative inline-flex flex-col items-center justify-center select-none', className)}>
      {/* Speech or Thought Bubble */}
      <AnimatePresence>
        {speechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={cn(
              'relative mb-3 z-20 px-4 py-2 text-xs font-bold text-slate-800 bg-white rounded-2xl shadow-xl border border-purple-100/80 whitespace-nowrap flex items-center gap-1.5',
              isThought && 'rounded-3xl border-purple-200 bg-gradient-to-r from-purple-50 via-white to-pink-50 text-purple-950 font-semibold'
            )}
          >
            {isThought ? <span className="text-sm">🤔</span> : null}
            <span>{speechBubble}</span>

            {/* Pointer / Tail */}
            {!isThought ? (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-purple-100" />
            ) : (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                <div className="w-2 h-2 rounded-full bg-white border border-purple-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-white border border-purple-200" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Backdrop */}
      {glow && (
        <motion.div
          animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/25 via-pink-500/20 to-cyan-400/25 blur-xl -z-10 pointer-events-none"
        />
      )}

      {/* Pointing Indicator */}
      {pointingDirection && (
        <motion.div
          animate={{
            x: pointingDirection === 'left' ? [-6, 0, -6] : pointingDirection === 'right' ? [6, 0, 6] : 0,
            y: pointingDirection === 'down' ? [4, 0, 4] : 0,
          }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className={cn(
            'absolute text-xl z-10 pointer-events-none drop-shadow-md',
            pointingDirection === 'left' && '-left-6 top-1/2 -translate-y-1/2',
            pointingDirection === 'right' && '-right-6 top-1/2 -translate-y-1/2',
            pointingDirection === 'down' && '-bottom-6 left-1/2 -translate-x-1/2'
          )}
        >
          {pointingDirection === 'left' ? '👈' : pointingDirection === 'right' ? '👉' : '👇'}
        </motion.div>
      )}

      {/* Mascot Image Container with Framer Motion */}
      <motion.div
        animate={animate ? getBounceVariant() : undefined}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <Image
          src={imgSrc}
          alt={`MentalMath Brain Mascot (${emotion})`}
          width={pixelSize}
          height={pixelSize}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setImgSrc('/mascot-happy.png')}
          className="w-full h-full object-contain drop-shadow-lg transition-all duration-300"
        />
      </motion.div>
    </div>
  );
}


