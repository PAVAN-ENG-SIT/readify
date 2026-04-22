// ═══════════════════════════════════════════════════════════
// READIFY — Date Utilities (Timezone-Safe)
// ═══════════════════════════════════════════════════════════

/**
 * Convert a UTC timestamp to a date string in the user's local timezone.
 * Returns YYYY-MM-DD format.
 */
export function toUserLocalDate(utcTimestamp: string | Date, timezone: string): string {
  const date = new Date(utcTimestamp);
  return date.toLocaleDateString('en-CA', { timeZone: timezone }); // en-CA gives YYYY-MM-DD
}

/**
 * Get today's date in the user's timezone as YYYY-MM-DD.
 */
export function getTodayInTimezone(timezone: string): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: timezone });
}

/**
 * Check if a given date string is today in the user's timezone.
 */
export function isTodayInTimezone(dateStr: string, timezone: string): boolean {
  return dateStr === getTodayInTimezone(timezone);
}

/**
 * Get yesterday's date in the user's timezone as YYYY-MM-DD.
 */
export function getYesterdayInTimezone(timezone: string): string {
  const now = new Date();
  // Get "now" in the user's timezone, then subtract a day
  const todayStr = getTodayInTimezone(timezone);
  const today = new Date(todayStr + 'T12:00:00'); // noon to avoid DST issues
  today.setDate(today.getDate() - 1);
  return today.toISOString().split('T')[0];
}

/**
 * Calculate the number of days between two date strings (YYYY-MM-DD).
 */
export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  const diffMs = Math.abs(b.getTime() - a.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Format a duration in seconds to human-readable string.
 * e.g., 3661 → "1h 1m"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Format a duration in seconds to mm:ss or hh:mm:ss.
 */
export function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}

/**
 * Get a relative time string (e.g., "2 hours ago", "yesterday").
 */
export function relativeTime(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get the start of the current week (Monday) in user timezone.
 */
export function getWeekStartInTimezone(timezone: string): string {
  const todayStr = getTodayInTimezone(timezone);
  const today = new Date(todayStr + 'T12:00:00');
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  today.setDate(today.getDate() - daysFromMonday);
  return today.toISOString().split('T')[0];
}

/**
 * Detect the user's browser timezone.
 */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Asia/Kolkata'; // fallback
  }
}
