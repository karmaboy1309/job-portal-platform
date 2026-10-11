/**
 * Date formatting utilities for job listings and applications.
 */

/**
 * Returns a human-friendly relative time string.
 * e.g. "just now", "15m ago", "3h ago", "yesterday", "4d ago", "2w ago"
 * @param {string|Date|number} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const target = new Date(date);
  if (isNaN(target.getTime())) return '';

  const diffMs = now - target;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 45) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Formats a date into a clean readable string (e.g., "Oct 11, 2026").
 * @param {string|Date|number} date
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatDate(date, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!date) return '';
  const target = new Date(date);
  if (isNaN(target.getTime())) return '';
  return target.toLocaleDateString('en-US', options);
}

/**
 * Formats a deadline date and returns status info (e.g. days remaining or expired).
 * @param {string|Date} deadline
 * @returns {{ label: string, isExpired: boolean, isUrgent: boolean }}
 */
export function formatDeadline(deadline) {
  if (!deadline) return { label: 'No deadline', isExpired: false, isUrgent: false };
  const target = new Date(deadline);
  if (isNaN(target.getTime())) return { label: 'Invalid date', isExpired: false, isUrgent: false };

  const now = new Date();
  const diffMs = target - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'Expired', isExpired: true, isUrgent: false };
  }
  if (diffDays === 0) {
    return { label: 'Closes today', isExpired: false, isUrgent: true };
  }
  if (diffDays === 1) {
    return { label: '1 day left', isExpired: false, isUrgent: true };
  }
  if (diffDays <= 3) {
    return { label: `${diffDays} days left`, isExpired: false, isUrgent: true };
  }
  return { label: `${diffDays} days left`, isExpired: false, isUrgent: false };
}
