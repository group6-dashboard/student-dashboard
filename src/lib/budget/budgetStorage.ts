

export type BudgetEntry = {
  id: string;
  category: string;
  amount: number;
  month: string;
  note?: string;
};

const STORAGE_KEY = 'student-dashboard:budget-entries:v1';

export function loadBudgetEntries(): BudgetEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Minimal validation
    return parsed.filter(
      (x) =>
        x &&
        typeof x.id === 'string' &&
        typeof x.category === 'string' &&
        typeof x.amount === 'number' &&
        typeof x.month === 'string',
    );
  } catch {
    return [];
  }
}

export function saveBudgetEntries(entries: BudgetEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore storage errors (quota, privacy mode)
  }
}
