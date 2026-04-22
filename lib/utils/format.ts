// ═══════════════════════════════════════════════════════════
// Readify — Format Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Format a number as a percentage string.
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a page count with "pages" suffix.
 */
export function formatPages(count: number): string {
  if (count === 1) return '1 page';
  return `${count} pages`;
}

/**
 * Format a large number with K/M suffixes.
 */
export function formatCompact(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Truncate text to a maximum length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format a streak count with appropriate label.
 */
export function formatStreak(count: number): string {
  if (count === 0) return 'No streak';
  if (count === 1) return '1 day';
  return `${count} days`;
}

/**
 * Generate initials from a name (e.g., "John Doe" → "JD").
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format a reading speed (pages per hour).
 */
export function formatReadingSpeed(pages: number, seconds: number): string {
  if (seconds === 0) return '0 pages/hr';
  const pagesPerHour = (pages / seconds) * 3600;
  return `${pagesPerHour.toFixed(1)} pages/hr`;
}

/**
 * Pluralize a word based on count.
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
}
