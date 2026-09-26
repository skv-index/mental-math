'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Brain, Info, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { METHODS } from '@/data/methods';
import { Difficulty } from '@/types';
import { fetchDefaultDifficulty, updateDefaultDifficulty } from '@/lib/updateUser';
import { useEffect } from 'react';
import SignOutButton from '@/components/SignOutButton';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>('medium');

  useEffect(() => {
    (async () => {
      const saved = await fetchDefaultDifficulty();
      if (saved) {
        setDefaultDifficulty(saved);
      } else {
        const stored = window.localStorage.getItem('defaultDifficulty');
        if (stored === 'easy' || stored === 'medium' || stored === 'hard') {
          setDefaultDifficulty(stored);
        }
      }
    })();
  }, []);

  const handleDifficultyChange = (diff: Difficulty) => {
    setDefaultDifficulty(diff);
    window.localStorage.setItem('defaultDifficulty', diff);
    updateDefaultDifficulty(diff);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#EDF1F7] sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#8B96AB]">Customize your practice experience.</p>
      </div>

      {/* Info notice */}
      <div className="flex items-start gap-2 rounded-xl border border-[#5EEAD4]/20 bg-[#5EEAD4]/5 p-3 text-xs text-[#8B96AB]">
        <Info size={14} className="mt-0.5 shrink-0 text-[#5EEAD4]" />
        <span>Settings apply to this session only. Account sync coming soon.</span>
      </div>

      {/* Sound */}
      <SettingRow
        icon={soundEnabled ? Volume2 : VolumeX}
        title="Sound effects"
        description="Play sounds for correct and incorrect answers"
      >
        <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
      </SettingRow>

      {/* Default difficulty */}
      <div className="card-surface p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="rounded-lg bg-[#5EEAD4]/10 p-2 text-[#5EEAD4]">
            <Brain size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#EDF1F7]">Default difficulty</p>
            <p className="text-xs text-[#8B96AB]">Applied when you start a new practice session</p>
          </div>
        </div>
        <div className="flex rounded-xl bg-[#0F1521] p-1 border border-[#5EEAD4]/10">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
            const color = d === 'easy' ? '#5EEAD4' : d === 'medium' ? '#FFB020' : '#FF6B6B';
            return (
              <button
                key={d}
                type="button"
                onClick={() => handleDifficultyChange(d)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                  defaultDifficulty === d ? 'text-[#0F1521]' : 'text-[#8B96AB] hover:text-[#EDF1F7]'
                }`}
                style={defaultDifficulty === d ? { backgroundColor: color } : {}}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Methods summary */}
      <div className="card-surface p-5">
        <p className="mb-3 text-sm font-semibold text-[#EDF1F7]">Available Methods</p>
        <div className="space-y-2">
          {METHODS.map((m) => (
            <div key={m.id} className="flex items-center gap-2 text-xs text-[#8B96AB]">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: m.colorHex }}
              />
              <span className="font-medium" style={{ color: m.colorHex }}>{m.name}</span>
              <span>—</span>
              <span>{m.tagline}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="card-surface p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="rounded-lg bg-[#FF6B6B]/10 p-2 text-[#FF6B6B]">
            <LogOut size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#EDF1F7]">Account</p>
            <p className="text-xs text-[#8B96AB]">Sign out of MentalMath on this device</p>
          </div>
        </div>
        <SignOutButton variant="full" />
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-surface flex items-center justify-between gap-4 p-5">
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-[#161E2E] p-2 text-[#8B96AB]">
          <Icon size={18} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#EDF1F7]">{title}</p>
          <p className="text-xs text-[#8B96AB]">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#FFB020]' : 'bg-[#8B96AB]/30'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-md transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
        style={{ backgroundColor: '#FFFFFF' }}
      />
    </button>
  );
}