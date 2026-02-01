export type MoodEmoji = '😞' | '😕' | '😐' | '🙂' | '😁';

export interface MoodEntry {
  id: string;
  ts: number; // ms
  emoji: MoodEmoji;
  tags: string[];
  note?: string;
}

export interface AppSettings {
  reduceMotion: boolean;
  highContrast: boolean;
}

export interface ExportBundle {
  version: 1;
  exportedAt: number;
  entries: MoodEntry[];
  settings: AppSettings;
}
