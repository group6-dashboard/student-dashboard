export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // Sun=0, Mon=1
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

export function endOfWeekSunday(date: Date): Date {
  const start = startOfWeekMonday(date);
  return addDays(start, 6);
}

export function clampDate(date: Date, min: Date, max: Date): Date {
  if (date < min) return new Date(min);
  if (date > max) return new Date(max);
  return date;
}

export function weeksBetween(
  startISO: string,
  endISO: string,
): Array<{ start: Date; end: Date }> {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);

  const firstWeekStart = startOfWeekMonday(start);
  const lastWeekEnd = endOfWeekSunday(end);

  const weeks: Array<{ start: Date; end: Date }> = [];
  let cursor = firstWeekStart;

  while (cursor <= lastWeekEnd) {
    const wStart = cursor;
    const wEnd = addDays(cursor, 6);
    weeks.push({
      start: clampDate(wStart, start, end),
      end: clampDate(wEnd, start, end),
    });
    cursor = addDays(cursor, 7);
  }

  return weeks;
}

export function formatRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short", day: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}
