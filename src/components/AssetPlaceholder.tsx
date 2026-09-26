'use client';

import React from 'react';
import {
  Image,
  Flame,
  Award,
  Trophy,
  Sparkles,
  Zap,
  Target,
  Box,
  Smile,
  BookOpen,
} from 'lucide-react';

export type AssetType =
  | 'hero-illustration'
  | 'method-icon'
  | 'achievement-badge'
  | 'trophy'
  | 'chest-reward'
  | 'mascot'
  | 'streak-flame'
  | 'xp-crystal'
  | 'daily-tip-illustration'
  | 'medal';

interface AssetPlaceholderProps {
  type: AssetType;
  label?: string;
  className?: string;
  unlocked?: boolean;
}

const ASSET_CONFIG: Record<
  AssetType,
  { defaultLabel: string; icon: React.ElementType; color: string }
> = {
  'hero-illustration': { defaultLabel: 'Hero Illustration', icon: Image, color: '#5EEAD4' },
  'method-icon': { defaultLabel: 'Method Icon', icon: BookOpen, color: '#A78BFA' },
  'achievement-badge': { defaultLabel: 'Badge Asset', icon: Award, color: '#FFB020' },
  trophy: { defaultLabel: 'Trophy Asset', icon: Trophy, color: '#FBBF24' },
  'chest-reward': { defaultLabel: 'Chest Reward', icon: Box, color: '#F472B6' },
  mascot: { defaultLabel: 'Mascot Companion', icon: Smile, color: '#38BDF8' },
  'streak-flame': { defaultLabel: 'Streak Flame', icon: Flame, color: '#FF6B6B' },
  'xp-crystal': { defaultLabel: 'XP Crystal', icon: Sparkles, color: '#FBBF24' },
  'daily-tip-illustration': { defaultLabel: 'Tip Graphic', icon: Zap, color: '#60A5FA' },
  medal: { defaultLabel: 'Medal Icon', icon: Target, color: '#34D399' },
};

export function AssetPlaceholder({
  type,
  label,
  className = '',
  unlocked = true,
}: AssetPlaceholderProps) {
  const config = ASSET_CONFIG[type] ?? {
    defaultLabel: 'Asset Placeholder',
    icon: Image,
    color: '#8B96AB',
  };
  const Icon = config.icon;
  const displayLabel = label ?? config.defaultLabel;

  return (
    <div
      className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 text-center transition-all ${
        unlocked
          ? 'border-[#5EEAD4]/20 bg-[#5EEAD4]/5 text-[#8B96AB] hover:border-[#5EEAD4]/40 hover:bg-[#5EEAD4]/10'
          : 'border-[#8B96AB]/20 bg-[#161E2E]/40 text-[#8B96AB]/40'
      } ${className}`}
      title={`Asset Placeholder: ${displayLabel}`}
    >
      <div
        className={`flex items-center justify-center rounded-lg p-2 transition-transform group-hover:scale-105 ${
          unlocked ? '' : 'grayscale opacity-40'
        }`}
        style={{ backgroundColor: `${config.color}1A`, color: config.color }}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <span className="mt-1 font-[family-name:var(--font-mono)] text-[10px] font-medium tracking-tight text-[#8B96AB]/80 uppercase">
        {displayLabel}
      </span>
      <span className="text-[9px] text-[#8B96AB]/40">[Asset Slot]</span>
    </div>
  );
}
