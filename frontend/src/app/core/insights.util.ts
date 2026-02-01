import { MoodEmoji, MoodEntry } from './mood.model';
import { daysBack, startOfDayMs } from './date.util';

export function emojiScore(e: MoodEmoji): number {
  switch (e) {
    case '😞':
      return 1;
    case '😕':
      return 2;
    case '😐':
      return 3;
    case '🙂':
      return 4;
    case '😁':
      return 5;
  }
}

export function lastNDays(entries: MoodEntry[], days: number): MoodEntry[] {
  const since = daysBack(Date.now(), days - 1);
  return entries.filter(e => e.ts >= startOfDayMs(since));
}

export function topTags(entries: MoodEntry[], limit = 5): Array<{ tag: string; count: number }> {
  const m = new Map<string, number>();
  for (const e of entries) {
    for (const t of e.tags) {
      const k = t.toLowerCase();
      m.set(k, (m.get(k) ?? 0) + 1);
    }
  }
  return [...m.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function trendLabel(scores: number[]): { label: string; delta: number } {
  if (scores.length < 4) return { label: 'Not enough data yet', delta: 0 };
  const mid = Math.floor(scores.length / 2);
  const a = avg(scores.slice(0, mid));
  const b = avg(scores.slice(mid));
  const delta = +(b - a).toFixed(2);
  if (Math.abs(delta) < 0.2) return { label: 'Steady', delta };
  if (delta > 0) return { label: 'Trending up', delta };
  return { label: 'Trending down', delta };
}

function avg(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0) / Math.max(1, nums.length);
}
