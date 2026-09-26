// ============================================================
// Central game constants — import from here instead of
// hardcoding values throughout the codebase.
// ============================================================

/** XP awarded per correct answer */
export const POINTS_PER_CORRECT = 10;

/** Minimum questions answered in a Mastery Challenge session to qualify */
export const METHOD_MASTERY_QUESTIONS = 10;

/** Minimum accuracy (%) required in Mastery Challenge to unlock next tier */
export const METHOD_MASTERY_ACCURACY = 80;

/** Maximum seed value for Mulberry32 PRNG (2^31 − 1) */
export const MAX_SEED = 2_147_483_647;

/** Default number of questions per practice session */
export const DEFAULT_SESSION_LENGTH = 10;

/** Questions in a Speed Drill session */
export const SPEED_DRILL_LENGTH = 15;

/** Default time limit (seconds) for easy questions */
export const TIME_EASY = 25;

/** Default time limit (seconds) for medium questions */
export const TIME_MEDIUM = 20;

/** Default time limit (seconds) for hard questions */
export const TIME_HARD = 12;

/** Time multiplier applied to Speed Drill sessions (70% of normal) */
export const SPEED_DRILL_TIME_FACTOR = 0.7;

/** Maximum display name length (enforced client + server) */
export const MAX_DISPLAY_NAME_LENGTH = 40;

/** Maximum leaderboard entries returned by the public API */
export const LEADERBOARD_PAGE_SIZE = 100;
