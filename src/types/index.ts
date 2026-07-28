// ===== Grade Levels =====
export type GradeLevel =
  | 'K' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  | '9' | '10' | '11' | '12' | 'College';

export interface LevelStage {
  id: GradeLevel;
  label: string;          // e.g. "Kindergarten", "Grade 5", "College"
  order: number;           // for sorting K=0, 1=1, ..., College=13
  description: string;
  colorTheme: string;       // tailwind color token, e.g. "cyan"
  unlocked: boolean;
}

// ===== Topics =====
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: string;
  levelId: GradeLevel;
  name: string;              // e.g. "Addition & Subtraction"
  description: string;
  icon: string;                // lucide icon name
  difficulty: Difficulty;
  questionCount: number;
  progress: number;             // 0-100, percent complete
  questionsCorrect?: number;
}

// ===== Questions =====
export type QuestionType = 'mcq' | 'numeric';

export interface Question {
  id: string;
  topicId: string;
  type: QuestionType;
  prompt: string;                // e.g. "23 + 48 = ?"
  correctAnswer: string | number;
  options?: string[];             // only for type: 'mcq'
  difficulty: Difficulty;
  timeLimitSeconds: number;
}

// ===== User =====
export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  currentLevel: GradeLevel;
  joinedAt: string;
  totalScore: number;
  currentStreak: number;
  defaultDifficulty: Difficulty; // add this
}

// ===== Progress Stats =====
export interface ProgressStats {
  userId: string;
  topicId: string;
  accuracy: number;                  // 0-100
  questionsAnswered: number;
  questionsCorrect: number;
  bestStreak: number;
  lastPracticedAt: string;             // ISO date
}

// ===== Leaderboard =====
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  score: number;
  level: GradeLevel;
}

// ===== Practice Session (runtime state, not stored) =====
export interface PracticeSessionResult {
  topicId: string;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  completedAt: string;
}