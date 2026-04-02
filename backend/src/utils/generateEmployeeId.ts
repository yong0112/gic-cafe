import { randomBytes } from 'crypto';

export function generateEmployeeId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(7);
  const suffix = Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join('');
  return `UI${suffix}`;
}
