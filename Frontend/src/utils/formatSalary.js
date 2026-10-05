/**
 * Formats a salary number into a readable string.
 * e.g. 75000 → "₹75K"  |  1500000 → "₹15L"
 * @param {number|string} value
 * @param {string} [currency="₹"]
 * @returns {string}
 */
export function formatSalary(value, currency = '₹') {
  const num = Number(value);
  if (!value || isNaN(num)) return 'Not disclosed';
  if (num >= 100000) {
    const lakhs = (num / 100000).toFixed(num % 100000 === 0 ? 0 : 1);
    return `${currency}${lakhs}L`;
  }
  if (num >= 1000) {
    const k = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1);
    return `${currency}${k}K`;
  }
  return `${currency}${num}`;
}

/**
 * Formats a salary range from min and max values.
 * e.g. (50000, 80000) → "₹50K – ₹80K"
 * @param {number|string} min
 * @param {number|string} max
 * @param {string} [currency="₹"]
 * @returns {string}
 */
export function formatSalaryRange(min, max, currency = '₹') {
  if (!min && !max) return 'Not disclosed';
  if (min && !max) return `From ${formatSalary(min, currency)}`;
  if (!min && max) return `Up to ${formatSalary(max, currency)}`;
  return `${formatSalary(min, currency)} – ${formatSalary(max, currency)}`;
}
