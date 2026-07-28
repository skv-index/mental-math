'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, ChevronRight, Gauge, type LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Topic, GradeLevel, Difficulty } from '@/types';
import { levels } from '@/data/levels';
import { fetchDefaultDifficulty, updateDefaultDifficulty } from '@/lib/updateUser';

const LOCK_TOOLTIP = 'Unlock this level by completing 20 questions at 70%+ accuracy in prior levels.';

export default function PracticePage() {
  const [selectedLevel, setSelectedLevel] = useState<GradeLevel>('K');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelStatus, setLevelStatus] = useState<Partial<Record<GradeLevel, boolean>>>({});
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium');

  useEffect(() => {
    (async () => {
      const accountValue = await fetchDefaultDifficulty();
      if (accountValue) {
        setCurrentDifficulty(accountValue);
      } else {
        const stored = window.localStorage.getItem('defaultDifficulty');
        if (stored === 'easy' || stored === 'medium' || stored === 'hard') {
          setCurrentDifficulty(stored);
        }
      }
    })();
  }, []);

  const handleDifficultyChange = (diff: Difficulty) => {
    setCurrentDifficulty(diff);
    window.localStorage.setItem('defaultDifficulty', diff);
    updateDefaultDifficulty(diff);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/topics?level=${selectedLevel}`)
      .then((r) => r.json())
      .then((data) => {
        setTopics(data.topics ?? []);
        setLoading(false);
      });
  }, [selectedLevel]);

  useEffect(() => {
    fetch('/api/levels')
      .then((r) => r.json())
      .then((data) => {
        const statusMap = (data.levels ?? []).reduce((acc: Record<GradeLevel, boolean>, item: { id: GradeLevel; unlocked: boolean }) => {
          acc[item.id] = item.unlocked;
          return acc;
        }, {});
        setLevelStatus(statusMap);
      });
  }, []);

  const levelsWithStatus = levels.map((level) => ({
    ...level,
    unlocked: levelStatus[level.id] ?? level.unlocked,
  }));

  const activeLevel = levelsWithStatus.find((l) => l.id === selectedLevel);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#EDF1F7] sm:text-3xl">
          Practice
        </h1>
        <p className="mt-1 text-sm text-[#8B96AB]">Pick a grade level and difficulty mode to explore topics.</p>
      </div>

      {/* Difficulty Mode Selector Card */}
      <div className="card-surface flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8B96AB]">
            <Gauge size={16} className="text-[#FFB020]" />
            <span>Practice Mode:</span>
          </div>
          <div className="flex rounded-xl bg-[#0F1521] p-1 border border-[#5EEAD4]/10">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleDifficultyChange(d)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  currentDifficulty === d
                    ? d === 'easy'
                      ? 'bg-[#5EEAD4] text-[#0F1521]'
                      : d === 'medium'
                      ? 'bg-[#FFB020] text-[#0F1521]'
                      : 'bg-[#FF6B6B] text-[#0F1521]'
                    : 'text-[#8B96AB] hover:text-[#EDF1F7]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#8B96AB]">
          Selected mode applies to all practice topics below.
        </p>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
        {levelsWithStatus.map((level) => (
          <LevelTab
            key={level.id}
            level={level}
            active={selectedLevel === level.id}
            onClick={() => level.unlocked && setSelectedLevel(level.id)}
          />
        ))}
      </div>

      {activeLevel && (
        <div className="card-surface p-4">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#EDF1F7]">
            {activeLevel.label}
          </p>
          <p className="mt-1 text-sm text-[#8B96AB]">{activeLevel.description}</p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-surface h-32 animate-pulse" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="card-surface p-8 text-center">
          <p className="text-sm text-[#8B96AB]">No topics available for this level yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} activeDifficulty={currentDifficulty} />
          ))}
        </div>
      )}
    </div>
  );
}

function LevelTab({ level, active, onClick }: { level: (typeof levels)[number]; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!level.unlocked}
      title={!level.unlocked ? LOCK_TOOLTIP : undefined}
      className={`flex min-w-[5rem] shrink-0 flex-col items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-[#FFB020] text-[#0F1521]'
          : level.unlocked
          ? 'bg-[#161E2E] text-[#EDF1F7] hover:bg-[#1C2536]'
          : 'cursor-not-allowed bg-[#161E2E]/50 text-[#8B96AB]/50'
      }`}
    >
      <div className="flex items-center gap-1">
        {!level.unlocked && <Lock size={12} strokeWidth={2.5} />}
        {level.id === 'K' ? 'K' : level.id === 'College' ? 'College' : `G${level.id}`}
      </div>
      {!level.unlocked && (
        <span className="text-[10px] text-[#8B96AB]">20 questions + 70% accuracy</span>
      )}
    </button>
  );
}

function TopicCard({ topic, activeDifficulty }: { topic: Topic; activeDifficulty: Difficulty }) {
  const Icon = (Icons[topic.icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;
  const difficultyColor =
    activeDifficulty === 'easy' ? '#5EEAD4' : activeDifficulty === 'medium' ? '#FFB020' : '#FF6B6B';

  return (
    <Link
      href={`/practice/session?topic=${topic.id}&difficulty=${activeDifficulty}`}
      className="card-surface group flex flex-col gap-3 p-4 transition-colors hover:bg-[#1C2536]"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-[#5EEAD4]/10 p-2 text-[#5EEAD4]">
          <Icon size={20} strokeWidth={2} />
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: `${difficultyColor}1A`, color: difficultyColor }}
        >
          {activeDifficulty} Mode
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#EDF1F7]">{topic.name}</p>
        <p className="mt-0.5 text-xs text-[#8B96AB] line-clamp-2">{topic.description}</p>
      </div>

      <div className="mt-auto space-y-1.5">
        <div className="progress-track">
          <div className="h-full rounded-full bg-[#FFB020] transition-all" style={{ width: `${topic.progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#8B96AB]">
          <span className="text-[#5EEAD4]">{topic.questionsCorrect != null ? `${topic.questionsCorrect} correct` : 'No correct answers yet'}</span>
          <span className="flex items-center gap-0.5 font-medium text-[#5EEAD4] opacity-0 transition-opacity group-hover:opacity-100">
            Start <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}