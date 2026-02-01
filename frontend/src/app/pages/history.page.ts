import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoodService } from '../core/mood.service';
import { fmtDay, fmtTime } from '../core/date.util';
import { MoodEntry, MoodEmoji } from '../core/mood.model';

@Component({
  standalone: true,
  selector: 'app-history-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './history.page.html',
  styleUrl: './history.page.css',
})
export class HistoryPage {
  private readonly mood = inject(MoodService);

  readonly entries = this.mood.entries;

  readonly tagQuery = signal('');
  readonly selectedId = signal<string | null>(null);

  readonly filtered = computed(() => {
    const q = this.tagQuery().trim().toLowerCase();
    const all = this.entries();
    if (!q) return all;
    return all.filter(e => e.tags.some(t => t.toLowerCase().includes(q)));
  });

  fmtDay = fmtDay;
  fmtTime = fmtTime;

  select(entry: MoodEntry): void {
    this.selectedId.set(this.selectedId() === entry.id ? null : entry.id);
  }

  update(entry: MoodEntry, patch: Partial<Pick<MoodEntry, 'emoji' | 'note'>> & { tagsText?: string }): void {
    const tags = patch.tagsText !== undefined
      ? patch.tagsText.split(',').map(s => s.trim()).filter(Boolean)
      : entry.tags;

    this.mood.updateEntry(entry.id, {
      emoji: (patch.emoji ?? entry.emoji) as MoodEmoji,
      note: patch.note ?? entry.note,
      tags,
    });
  }

  remove(entry: MoodEntry): void {
    if (!confirm('Delete this check-in?')) return;
    this.mood.deleteEntry(entry.id);
    if (this.selectedId() === entry.id) this.selectedId.set(null);
  }
}
