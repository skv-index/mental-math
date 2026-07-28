import { redirect } from 'next/navigation';
import { Flame, TrendingUp, Trophy, Calendar, Award, Star, Zap, Target } from 'lucide-react';
import { fetchCurrentUser, fetchProgressByUser, fetchOverallAccuracy } from '@/lib/getUser';
import { fetchTopicsByIds } from '@/lib/getTopics';
import { levels } from '@/data/levels';

export default async function ProfilePage() {
  const user = await fetchCurrentUser();

if (!user) {
  redirect('/login');
}

const progress = await fetchProgressByUser(user.id);
const accuracy = await fetchOverallAccuracy(user.id);

// Single query for all topic names — avoids N+1
const topicIds = progress.map((p) => p.topicId);
const topicMap = await fetchTopicsByIds(topicIds);
const topicsWithNames = progress.map((p) => ({ ...p, topic: topicMap.get(p.topicId) }));

const totalQuestions = progress.reduce((sum, p) => sum + p.questionsAnswered, 0);
const totalCorrect = progress.reduce((sum, p) => sum + p.questionsCorrect, 0);
// Use reduce instead of spread to avoid call-stack overflow on large arrays
const bestStreakOverall = progress.reduce((max, p) => Math.max(max, p.bestStreak), 0);
const levelInfo = levels.find((l) => l.id === user.currentLevel);

const badges = [
  { id: 'streak-5', label: '5-Day Streak', icon: Flame, earned: user.currentStreak >= 5 },
  { id: 'accuracy-80', label: '80% Accuracy', icon: Target, earned: accuracy >= 80 },
  { id: 'questions-100', label: '100 Questions', icon: Zap, earned: totalQuestions >= 100 },
  { id: 'topics-5', label: '5 Topics Started', icon: Star, earned: progress.length >= 5 },
  { id: 'streak-10', label: '10-Day Streak', icon: Award, earned: bestStreakOverall >= 10 },
  { id: 'perfect', label: 'Perfect Session', icon: Trophy, earned: false },
];

const joinDate = new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="card-surface flex items-center gap-4 p-5 sm:p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FFB020]/10 text-2xl font-bold text-[#FFB020]">
          {user.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#EDF1F7]">
            {user.name}
          </h1>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#8B96AB]">
            <Calendar size={12} /> Joined {joinDate}
          </p>
        </div>
        <div className="shrink-0 rounded-full bg-[#161E2E] px-3 py-1.5 text-center">
          <p className="text-[10px] text-[#8B96AB]">Level</p>
          <p className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[#EDF1F7]">
            {levelInfo?.label ?? user.currentLevel}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Flame} color="#FFB020" label="Current streak" value={user.currentStreak} />
        <StatCard icon={TrendingUp} color="#5EEAD4" label="Overall accuracy" value={`${accuracy}%`} />
        <StatCard icon={Trophy} color="#FF6B6B" label="Total score" value={user.totalScore.toLocaleString()} />
        <StatCard icon={Award} color="#8B96AB" label="Best streak" value={bestStreakOverall} />
      </div>

      {/* Badges */}
      <div className="card-surface p-5">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[#EDF1F7]">
          Badges
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.id} className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    badge.earned ? 'bg-[#FFB020]/10 text-[#FFB020]' : 'bg-[#161E2E] text-[#8B96AB]/30'
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <p
                  className={`text-center text-[10px] leading-tight ${
                    badge.earned ? 'text-[#EDF1F7]' : 'text-[#8B96AB]/50'
                  }`}
                >
                  {badge.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress by topic */}
      <div className="card-surface p-5">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold text-[#EDF1F7]">
          Progress by topic
        </h2>
        {topicsWithNames.length === 0 ? (
          <p className="text-sm text-[#8B96AB]">No practice history yet. Start a session to see progress here.</p>
        ) : (
          <div className="space-y-4">
            {topicsWithNames
              .sort((a, b) => b.accuracy - a.accuracy)
              .map((p) => (
                <div key={p.topicId}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-[#EDF1F7]">{p.topic?.name ?? p.topicId}</span>
                    <span className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[#8B96AB]">
                      {p.accuracy}% · {p.questionsCorrect}/{p.questionsAnswered}
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="h-full rounded-full bg-[#5EEAD4] transition-all"
                      style={{ width: `${p.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof Flame;
  color: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center gap-1.5" style={{ color }}>
        <Icon size={16} strokeWidth={2.5} />
        <span className="text-xs font-medium text-[#8B96AB]">{label}</span>
      </div>
      <p className="mt-1 font-[family-name:var(--font-mono)] text-2xl font-semibold text-[#EDF1F7]">{value}</p>
    </div>
  );
}