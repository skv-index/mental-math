'use client';

import { useState } from 'react';
import { Volume2, VolumeX, GraduationCap, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GradeLevel } from '@/types';
import { levels } from '@/data/levels';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [defaultLevel, setDefaultLevel] = useState<GradeLevel>('7');

  const unlockedLevels = levels.filter((l) => l.unlocked);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#EDF1F7] sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#8B96AB]">Customize your practice experience.</p>
      </div>

      {/* Not-yet-persisted notice */}
      <div className="flex items-start gap-2 rounded-xl border border-[#5EEAD4]/20 bg-[#5EEAD4]/5 p-3 text-xs text-[#8B96AB]">
        <Info size={14} className="mt-0.5 shrink-0 text-[#5EEAD4]" />
        <span>Settings apply to this session only. Account sync is coming soon.</span>
      </div>

      {/* Sound */}
      <SettingRow
        icon={soundEnabled ? Volume2 : VolumeX}
        title="Sound effects"
        description="Play sounds for correct and incorrect answers"
      >
        <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
      </SettingRow>

      {/* Default grade level */}
      <div className="card-surface p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="rounded-lg bg-[#5EEAD4]/10 p-2 text-[#0E7A90]">
            <GraduationCap size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Default grade level</p>
            <p className="text-xs text-[#475569]">Which level Learn opens to by default</p>
          </div>
        </div>
        <select
          value={defaultLevel}
          onChange={(e) => setDefaultLevel(e.target.value as GradeLevel)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#0E7A90]"
        >
          {unlockedLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.label}
            </option>
          ))}
        </select>
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