// ═══════════════════════════════════════════════════════════
// Readify — Application Constants
// ═══════════════════════════════════════════════════════════

// ── Session Engine ──
export const SESSION_HEARTBEAT_INTERVAL_MS = 30_000;     // 30 seconds
export const SESSION_IDLE_THRESHOLD_MS = 300_000;         // 5 minutes
export const SESSION_CRASH_THRESHOLD_MS = 120_000;        // 2 minutes (stale heartbeat)
export const SESSION_MAX_DURATION_MS = 14_400_000;        // 4 hours max session

// ── Streak Engine ──
export const STREAK_FREEZE_MAX_DAYS = 2;                  // max freeze/grace days
export const STREAK_DEFAULT_DAILY_TARGET_PAGES = 20;
export const STREAK_DEFAULT_DAILY_TARGET_MINUTES = 30;

// ── Contract Engine ──
export const CONTRACT_DEFAULT_COMMITMENT_DAYS = 30;
export const CONTRACT_WEEKLY_BUFFER_MULTIPLIER = 7;       // daily × 7 = weekly target

// ── UI ──
export const TOAST_DURATION_MS = 4000;
export const DEBOUNCE_SEARCH_MS = 400;
export const BOOKS_PER_PAGE = 12;
export const SESSIONS_PER_PAGE = 10;

// ── API ──
export const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
export const MAX_SEARCH_RESULTS = 20;

// ── App ──
export const APP_NAME = 'Readify';
export const APP_DESCRIPTION = 'Build unbreakable reading habits. Track progress, maintain streaks, and never lose context.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ── Status Enums ──
export const BOOK_STATUS = {
  READING: 'reading',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  ABANDONED: 'abandoned',
} as const;

export const SESSION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  CRASHED: 'crashed',
} as const;

export const CONTRACT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  BROKEN: 'broken',
  PAUSED: 'paused',
} as const;

export const STREAK_STATUS = {
  ACTIVE: 'active',
  BROKEN: 'broken',
  FROZEN: 'frozen',
} as const;

export const CONTRACT_ENFORCEMENT = {
  SOFT: 'soft',
  STRICT: 'strict',
} as const;

export const CONTRACT_BUFFER = {
  WEEKLY_AVG: 'weekly_avg',
  DAILY_STRICT: 'daily_strict',
} as const;
