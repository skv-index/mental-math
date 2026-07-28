'use client';

import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { LeaderboardEntry, GradeLevel } from '@/types';
import { levels } from '@/data/levels';
import { createClient } from '@/lib/supabase/client';

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<GradeLevel | 'all'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/leaderboard?level=${filter}`)
      .then((r) => r.json())
      .then((data) => {
        if (!ignore) {
          setEntries(data.entries ?? []);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [filter]);

  const unlockedLevels = levels.filter((l) => l.unlocked);
  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#EDF1F7] sm:text-3xl">
          Leaderboard
        </h1>
        <p className="mt-1 text-sm text-[#8B96AB]">See how you stack up against other learners.</p>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
        <FilterTab
          label="All levels"
          active={filter === 'all'}
          onClick={() => {
            if (filter !== 'all') {
              setFilter('all');
              setLoading(true);
            }
          }}
        />
        {unlockedLevels.map((level) => (
          <FilterTab
            key={level.id}
            label={level.id === 'K' ? 'K' : level.id === 'College' ? 'College' : `G${level.id}`}
            active={filter === level.id}
            onClick={() => {
              if (filter !== level.id) {
                setFilter(level.id);
                setLoading(true);
              }
            }}
          />
        ))}
      </div>

      {loading ? (
        <div className="card-surface h-64 animate-pulse" />
      ) : entries.length === 0 ? (
        <div className="card-surface p-8 text-center">
          <p className="text-sm text-[#8B96AB]">No entries for this level yet.</p>
        </div>
      ) : (
        <>
          {topThree.length === 3 && (
            <div className="flex items-end justify-center gap-3 pt-4">
              <PodiumCard entry={topThree[1]} height="h-24" currentUserId={currentUserId} />
              <PodiumCard entry={topThree[0]} height="h-32" isFirst currentUserId={currentUserId} />
              <PodiumCard entry={topThree[2]} height="h-20" currentUserId={currentUserId} />
            </div>
          )}

          <div className="card-surface divide-y divide-[#5EEAD4]/10">
            {(topThree.length === 3 ? rest : entries).map((entry) => (
              <LeaderboardRow key={entry.userId} entry={entry} currentUserId={currentUserId} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-[#FFB020] text-[#0F1521]' : 'bg-[#161E2E] text-[#EDF1F7] hover:bg-[#1C2536]'
      }`}
    >
      {label}
    </button>
  );
}

function PodiumCard({
  entry,
  height,
  isFirst,
  currentUserId,
}: {
  entry: LeaderboardEntry;
  height: string;
  isFirst?: boolean;
  currentUserId: string | null;
}) {
  const isMe = entry.userId === currentUserId;
  return (
    <div className="flex w-24 flex-col items-center gap-2">
      <div className="relative">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${
            isFirst ? 'bg-[#FFB020] text-[#0F1521]' : 'bg-[#161E2E] text-[#EDF1F7]'
          }`}
        >
          {entry.name.charAt(0)}
        </div>
        {isFirst && <Crown size={18} className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#FFB020]" />}
      </div>
      <p className="text-center text-xs font-medium text-[#EDF1F7] line-clamp-1">
        {isMe ? 'You' : entry.name.split(' ')[0]}
      </p>
      <p className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[#FFB020]">
        {entry.score.toLocaleString()}
      </p>
      <div className={`w-full rounded-t-lg ${height} ${isFirst ? 'bg-[#FFB020]/20' : 'bg-[#161E2E]'} flex items-start justify-center pt-2`}>
        <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#8B96AB]">#{entry.rank}</span>
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, currentUserId }: { entry: LeaderboardEntry; currentUserId: string | null }) {
  const isMe = entry.userId === currentUserId;
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${isMe ? 'bg-[#FFB020]/5' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="w-6 font-[family-name:var(--font-mono)] text-sm font-semibold text-[#8B96AB]">
          {entry.rank}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#161E2E] text-xs font-semibold text-[#EDF1F7]">
          {entry.name.charAt(0)}
        </div>
        <div>
          <p className={`text-sm font-medium ${isMe ? 'text-[#FFB020]' : 'text-[#EDF1F7]'}`}>
            {isMe ? 'You' : entry.name}
          </p>
          <p className="text-[11px] text-[#8B96AB]">
            {entry.level === 'K' ? 'Kindergarten' : entry.level === 'College' ? 'College' : `Grade ${entry.level}`}
          </p>
        </div>
      </div>
      <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[#EDF1F7]">
        {entry.score.toLocaleString()}
      </span>
    </div>
  );
}