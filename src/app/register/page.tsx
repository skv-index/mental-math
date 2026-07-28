'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX, Gauge, GraduationCap, Info, User, Loader2, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GradeLevel, Difficulty } from '@/types';
import { levels } from '@/data/levels';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('1');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>('medium');

  const unlockedLevels = levels.filter((l) => l.unlocked);

  useEffect(() => {
    const storedDifficulty = window.localStorage.getItem('defaultDifficulty');
    if (storedDifficulty === 'easy' || storedDifficulty === 'medium' || storedDifficulty === 'hard') {
      setDefaultDifficulty(storedDifficulty);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('defaultDifficulty', defaultDifficulty);
  }, [defaultDifficulty]);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, current_level')
        .eq('id', user.id)
        .single();

      if (profile) {
        setName(profile.name);
        setGrade(profile.current_level as GradeLevel);
      }
      setLoadingProfile(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveProfile() {
    if (!userId || !name.trim()) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from('profiles')
      .update({ name: name.trim(), current_level: grade })
      .eq('id', userId);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#EDF1F7] sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#8B96AB]">Manage your account and practice preferences.</p>
      </div>

      {/* Account settings — real, saved to database */}
      <div className="card-surface p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="rounded-lg bg-[#FFB020]/10 p-2 text-[#FFB020]">
            <User size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#EDF1F7]">Account</p>
            <p className="text-xs text-[#8B96AB]">Your name and grade level, shown on the leaderboard</p>
          </div>
        </div>

        {loadingProfile ? (
          <div className="h-20 animate-pulse rounded-lg bg-[#0F1521]" />
        ) : (
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#8B96AB]">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="w-full rounded-lg border border-[#5EEAD4]/10 bg-[#0F1521] px-3 py-2.5 text-sm text-[#EDF1F7] outline-none focus:border-[#5EEAD4]/50"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-[#8B96AB]">
                <GraduationCap size={12} /> Grade level
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="w-full rounded-lg border border-[#5EEAD4]/10 bg-[#0F1521] px-3 py-2.5 text-sm text-[#EDF1F7] outline-none focus:border-[#5EEAD4]/50"
              >
                {unlockedLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving || !name.trim()}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#FFB020] py-2.5 text-sm font-semibold text-[#0F1521] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : saved ? (
                <>
                  <Check size={16} /> Saved
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Not-yet-persisted notice — only applies to the section below now */}
      <div className="flex items-start gap-2 rounded-xl border border-[#5EEAD4]/20 bg-[#5EEAD4]/5 p-3 text-xs text-[#8B96AB]">
        <Info size={14} className="mt-0.5 shrink-0 text-[#5EEAD4]" />
        <span>The preferences below apply to this session only for now.</span>
      </div>

      <SettingRow
        icon={soundEnabled ? Volume2 : VolumeX}
        title="Sound effects"
        description="Play sounds for correct and incorrect answers"
      >
        <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
      </SettingRow>

      <SettingRow
        icon={Gauge}
        title="Default difficulty"
        description="Starting difficulty for new practice sessions"
      >
        <div className="flex gap-2 w-full">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDefaultDifficulty(d)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                defaultDifficulty === d
                  ? 'bg-[#FFB020] text-[#0F1521]'
                  : 'bg-[#0F1521] text-[#8B96AB] hover:bg-[#1C2536] hover:text-[#EDF1F7]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </SettingRow>
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
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-[#FFB020]' : 'bg-[#161E2E]'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#0F1521] transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}