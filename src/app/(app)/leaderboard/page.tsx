'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Crown, Zap } from 'lucide-react';
import { LeaderboardEntry } from '@/types';
import { createClient } from '@/lib/supabase/client';

const PODIUM = [
  { rank: 1, height: 'h-32', grad: 'linear-gradient(135deg,#FBBF24,#FB923C)', shadow: 'rgba(251,191,36,0.35)', scale: 'scale-110' },
  { rank: 2, height: 'h-24', grad: 'linear-gradient(135deg,#7C4DFF,#A855F7)', shadow: 'rgba(124,77,255,0.30)', scale: 'scale-100' },
  { rank: 3, height: 'h-20', grad: 'linear-gradient(135deg,#22D3EE,#7C4DFF)', shadow: 'rgba(34,211,238,0.30)', scale: 'scale-100' },
];

export default function LeaderboardPage() {
  const [entries,       setEntries]       = useState<LeaderboardEntry[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => { setEntries(data.entries ?? []); setLoading(false); });
  }, []);

  const topThree = entries.slice(0, 3);
  const rest     = entries.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-800 text-[#111827] sm:text-3xl">
          Leaderboard
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Global ranking by total XP. See how you stack up against other learners.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-[16px]" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div
          className="rounded-[24px] p-10 text-center"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}
        >
          <p className="text-2xl mb-2">🏆</p>
          <p className="font-semibold text-[#111827]">No entries yet</p>
          <p className="text-sm text-[#9CA3AF] mt-1">Start practicing to earn XP and claim the top spot!</p>
        </div>
      ) : (
        <>
          {/* Podium — show when we have top 3 */}
          {topThree.length === 3 && (
            <div
              className="rounded-[24px] p-6 pb-0 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg,rgba(124,77,255,0.06) 0%,rgba(244,114,182,0.06) 100%)',
                border: '1.5px solid rgba(124,77,255,0.12)',
              }}
            >
              <p className="text-center text-xs font-bold uppercase tracking-widest mb-6"
                style={{ color: '#7C4DFF' }}>
                Top Performers
              </p>
              <div className="flex items-end justify-center gap-4">
                {/* 2nd place */}
                <PodiumCard entry={topThree[1]} cfg={PODIUM[1]} currentUserId={currentUserId} />
                {/* 1st place */}
                <PodiumCard entry={topThree[0]} cfg={PODIUM[0]} currentUserId={currentUserId} />
                {/* 3rd place */}
                <PodiumCard entry={topThree[2]} cfg={PODIUM[2]} currentUserId={currentUserId} />
              </div>
            </div>
          )}

          {/* Rest of the table */}
          <div
            className="rounded-[20px] overflow-hidden"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            {(topThree.length === 3 ? rest : entries).map((entry, idx) => (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                currentUserId={currentUserId}
                isLast={idx === (topThree.length === 3 ? rest : entries).length - 1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PodiumCard({
  entry,
  cfg,
  currentUserId,
}: {
  entry: LeaderboardEntry;
  cfg: typeof PODIUM[number];
  currentUserId: string | null;
}) {
  const isMe = entry.userId === currentUserId;
  return (
    <div className={`flex flex-col items-center gap-2 ${cfg.scale}`}>
      {/* Crown for #1 */}
      {cfg.rank === 1 && (
        <Crown size={22} style={{ color: '#FBBF24' }} className="mb-1 animate-float" />
      )}

      {/* Avatar */}
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-full overflow-hidden text-lg font-bold text-white shadow-lg"
        style={{ background: cfg.grad, boxShadow: `0 6px 20px ${cfg.shadow}` }}
      >
        {isMe ? (
          <Image src="/mascot-happy.png" alt="Your Avatar" fill sizes="56px" className="object-contain p-1 bg-white/20" />
        ) : (
          entry.name.charAt(0).toUpperCase()
        )}
      </div>

      {/* Name */}
      <p className="text-center text-xs font-semibold text-[#111827] line-clamp-1 max-w-[72px]">
        {isMe ? 'You 🫵' : entry.name.split(' ')[0]}
      </p>

      {/* XP */}
      <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#7C4DFF' }}>
        <Zap size={11} /> {entry.score.toLocaleString()}
      </div>

      {/* Podium block */}
      <div
        className={`w-20 ${cfg.height} rounded-t-xl flex items-start justify-center pt-2 font-mono text-sm font-bold text-white`}
        style={{ background: cfg.grad, boxShadow: `0 -4px 16px ${cfg.shadow}` }}
      >
        #{entry.rank}
      </div>
    </div>
  );
}

function LeaderboardRow({
  entry,
  currentUserId,
  isLast,
}: {
  entry: LeaderboardEntry;
  currentUserId: string | null;
  isLast: boolean;
}) {
  const isMe = entry.userId === currentUserId;
  return (
    <div
      className="flex items-center justify-between px-5 py-4 transition-colors"
      style={{
        borderBottom: isLast ? 'none' : '1px solid rgba(124,77,255,0.07)',
        background: isMe ? 'rgba(124,77,255,0.05)' : 'transparent',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <span
          className="w-7 text-center font-[family-name:var(--font-mono)] text-sm font-bold"
          style={{ color: entry.rank <= 3 ? '#FBBF24' : '#9CA3AF' }}
        >
          #{entry.rank}
        </span>

        {/* Avatar */}
        <div
          className="relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden text-xs font-bold text-white shrink-0"
          style={{
            background: isMe
              ? 'linear-gradient(135deg,#7C4DFF,#A855F7)'
              : 'linear-gradient(135deg,#9CA3AF,#6B7280)',
            boxShadow: isMe ? '0 2px 8px rgba(124,77,255,0.30)' : 'none',
          }}
        >
          {isMe ? (
            <Image src="/mascot-happy.png" alt="Your Avatar" fill sizes="36px" className="object-contain p-0.5 bg-white/20" />
          ) : (
            entry.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Name */}
        <p
          className="text-sm font-semibold"
          style={{ color: isMe ? '#7C4DFF' : '#111827' }}
        >
          {isMe ? 'You 🫵' : entry.name}
        </p>
      </div>

      {/* Score */}
      <div className="flex items-center gap-1.5">
        <Zap size={13} style={{ color: '#FBBF24' }} />
        <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#111827]">
          {entry.score.toLocaleString()} XP
        </span>
      </div>
    </div>
  );
}