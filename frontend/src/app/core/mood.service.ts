import { Injectable, computed, signal } from '@angular/core';
import { AppSettings, ExportBundle, MoodEntry, MoodEmoji } from './mood.model';
import { STORAGE_KEY } from './storage.keys';
import { isSameDay, startOfDayMs } from './date.util';
import { uid } from './id.util';

type Persisted = {
  version: 1;
  entries: MoodEntry[];
  settings: AppSettings;
};

const DEFAULT_SETTINGS: AppSettings = {
  reduceMotion: false,
  highContrast: false,
};

function safeParse(json: string | null): Persisted | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (parsed?.version !== 1) return null;
    if (!Array.isArray(parsed?.entries)) return null;
    return parsed as Persisted;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class MoodService {
  private readonly _entries = signal<MoodEntry[]>([]);
  private readonly _settings = signal<AppSettings>(DEFAULT_SETTINGS);

  readonly entries = computed(() => this._entries().slice().sort((a, b) => b.ts - a.ts));
  readonly settings = computed(() => this._settings());

  constructor() {
    this.load();
  }

  private persist(): void {
    const payload: Persisted = {
      version: 1,
      entries: this._entries(),
      settings: this._settings(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  load(): void {
    const persisted = safeParse(localStorage.getItem(STORAGE_KEY));
    if (!persisted) {
      this._entries.set([]);
      this._settings.set(DEFAULT_SETTINGS);
      return;
    }

    const cleaned: MoodEntry[] = persisted.entries
      .filter((e: any) => typeof e?.id === 'string' && typeof e?.ts === 'number' && typeof e?.emoji === 'string')
      .map((e: any) => ({
        id: e.id,
        ts: e.ts,
        emoji: e.emoji as MoodEmoji,
        tags: Array.isArray(e.tags) ? e.tags.filter((t: any) => typeof t === 'string').slice(0, 12) : [],
        note: typeof e.note === 'string' ? e.note.slice(0, 280) : undefined,
      }));

    this._entries.set(cleaned);
    this._settings.set({
      reduceMotion: !!persisted.settings?.reduceMotion,
      highContrast: !!persisted.settings?.highContrast,
    });
  }

  addEntry(input: { emoji: MoodEmoji; tags: string[]; note?: string }): MoodEntry {
    const entry: MoodEntry = {
      id: uid('mood'),
      ts: Date.now(),
      emoji: input.emoji,
      tags: (input.tags || []).map(t => t.trim()).filter(Boolean).slice(0, 8),
      note: input.note?.trim() ? input.note.trim().slice(0, 280) : undefined,
    };
    this._entries.set([entry, ...this._entries()]);
    this.persist();
    return entry;
  }

  updateEntry(id: string, patch: Partial<Pick<MoodEntry, 'emoji' | 'tags' | 'note'>>): void {
    const next = this._entries().map(e => {
      if (e.id !== id) return e;
      return {
        ...e,
        ...patch,
        tags: patch.tags ? patch.tags.map(t => t.trim()).filter(Boolean).slice(0, 8) : e.tags,
        note: typeof patch.note === 'string' ? (patch.note.trim() ? patch.note.trim().slice(0, 280) : undefined) : e.note,
      };
    });
    this._entries.set(next);
    this.persist();
  }

  deleteEntry(id: string): void {
    this._entries.set(this._entries().filter(e => e.id !== id));
    this.persist();
  }

  setSettings(patch: Partial<AppSettings>): void {
    this._settings.set({ ...this._settings(), ...patch });
    this.persist();
  }

  entryForToday(): MoodEntry | undefined {
    const now = Date.now();
    return this._entries().find(e => isSameDay(e.ts, now));
  }

  streakDays(): number {
    const entries = this._entries().slice().sort((a, b) => b.ts - a.ts);
    if (entries.length === 0) return 0;

    const days = new Set<number>(entries.map(e => startOfDayMs(e.ts)));

    let streak = 0;
    let cursor = startOfDayMs(Date.now());

    while (days.has(cursor)) {
      streak += 1;
      cursor -= 24 * 60 * 60 * 1000;
    }

    return streak;
  }

  exportBundle(): ExportBundle {
    return {
      version: 1,
      exportedAt: Date.now(),
      entries: this._entries(),
      settings: this._settings(),
    };
  }

  importBundle(json: string): { ok: true; imported: number } | { ok: false; error: string } {
    let parsed: any;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { ok: false, error: 'Invalid JSON.' };
    }

    if (parsed?.version !== 1 || !Array.isArray(parsed?.entries)) {
      return { ok: false, error: 'Not a MoodMinute export (version mismatch).' };
    }

    const cleaned: MoodEntry[] = parsed.entries
      .filter((e: any) => typeof e?.id === 'string' && typeof e?.ts === 'number' && typeof e?.emoji === 'string')
      .map((e: any) => ({
        id: e.id,
        ts: e.ts,
        emoji: e.emoji as MoodEmoji,
        tags: Array.isArray(e.tags) ? e.tags.filter((t: any) => typeof t === 'string').slice(0, 12) : [],
        note: typeof e.note === 'string' ? e.note.slice(0, 280) : undefined,
      }));

    this._entries.set(cleaned);
    this._settings.set({
      reduceMotion: !!parsed.settings?.reduceMotion,
      highContrast: !!parsed.settings?.highContrast,
    });
    this.persist();

    return { ok: true, imported: cleaned.length };
  }
}
