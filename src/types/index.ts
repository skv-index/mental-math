// ===== Difficulty =====
export type Difficulty = 'easy' | 'medium' | 'hard';

// ===== Practice Stage (re-exported from data/methods for convenience) =====
export type { PracticeStage, MethodId, MethodDefinition } from '@/data/methods';

// ===== Questions =====
export type QuestionType = 'mcq' | 'numeric';

export interface Question {
  id: string;
  topicId: string;      // stores methodId (e.g. "make10") — kept as topicId for DB compatibility
  type: QuestionType;
  prompt: string;
  correctAnswer: string | number;
  options?: string[];   // only for type: 'mcq'
  hint?: string;        // only for 'guided' stage
  difficulty: Difficulty;
  timeLimitSeconds: number;
}

// ===== User =====
export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  methodsMastered: number;  // computed from progress; replaces currentLevel display
  joinedAt: string;
  totalScore: number;
  currentStreak: number;
  defaultDifficulty: Difficulty;
}

// ===== Progress Stats =====
// topic_id in DB stores composite key: "{methodId}-{difficulty}" e.g. "make10-easy"
export interface ProgressStats {
  userId: string;
  topicId: string;      // e.g. "make10-easy"
  accuracy: number;     // 0-100
  questionsAnswered: number;
  questionsCorrect: number;
  bestStreak: number;
  lastPracticedAt: string; // ISO date
}

// ===== Leaderboard =====
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  score: number;
  methodsMastered?: number; // computed — replaces level display
}

// ===== Practice Session (runtime state, not stored) =====
export interface PracticeSessionResult {
  topicId: string;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  completedAt: string;
}