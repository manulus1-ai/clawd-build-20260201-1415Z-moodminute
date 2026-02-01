export function startOfDayMs(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function fmtDay(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function fmtTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function isSameDay(a: number, b: number): boolean {
  return startOfDayMs(a) === startOfDayMs(b);
}

export function daysBack(fromTs: number, days: number): number {
  return fromTs - days * 24 * 60 * 60 * 1000;
}
