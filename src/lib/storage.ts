import type { AppData } from '@/types';

const STORAGE_KEY = 'petsphere:data:v1';
const SESSION_KEY = 'petsphere:session:v1';
const THEME_KEY = 'petsphere:theme:v1';

export const emptyData: AppData = {
  users: [],
  pets: [],
  vaccines: [],
  medicalHistory: [],
  allergies: [],
  weights: [],
  vetVisits: [],
  medications: [],
  feedings: [],
  gallery: [],
  journal: [],
  reminders: [],
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyData };
    const parsed = JSON.parse(raw) as Partial<AppData>;
    const merged = { ...emptyData, ...parsed };
    // Deduplicate pets by id — if duplicate IDs exist, keep the last one.
    const seen = new Set<string>();
    merged.pets = [...merged.pets].reverse().filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }).reverse();
    return merged;
  } catch {
    return { ...emptyData };
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save data', err);
  }
}

export function loadSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function saveSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function loadTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function relativeDays(iso: string): number {
  if (!iso) return Infinity;
  const due = new Date(iso);
  const today = new Date(todayISO());
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}
