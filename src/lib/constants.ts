// ============================================================
// Central game constants — import from here instead of
// hardcoding values throughout the codebase.
// ============================================================

/** XP awarded per correct answer */
export const POINTS_PER_CORRECT = 10;

/** Minimum questions answered in a grade before the next grade unlocks */
export const LEVEL_UNLOCK_QUESTIONS_THRESHOLD = 20;

/** Minimum weighted-average accuracy (%) required to unlock next grade */
export const LEVEL_UNLOCK_ACCURACY_THRESHOLD = 70;

/** Maximum seed value for Mulberry32 PRNG (2^31 − 1) */
export const MAX_SEED = 2_147_483_647;

/** Default number of questions per practice session */
export const DEFAULT_SESSION_LENGTH = 10;

/** Default time limit (seconds) for easy questions */
export const TIME_EASY = 25;

/** Default time limit (seconds) for medium questions */
export const TIME_MEDIUM = 20;

/** Default time limit (seconds) for hard questions */
export const TIME_HARD = 12;

/** Maximum display name length (enforced client + server) */
export const MAX_DISPLAY_NAME_LENGTH = 40;

/** Maximum leaderboard entries returned by the public API */
export const LEADERBOARD_PAGE_SIZE = 100;
