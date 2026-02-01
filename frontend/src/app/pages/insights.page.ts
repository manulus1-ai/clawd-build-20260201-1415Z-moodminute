import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MoodService } from '../core/mood.service';
import { emojiScore, lastNDays, topTags, trendLabel } from '../core/insights.util';
import { encodePayload } from '../core/share.util';
import { fmtDay } from '../core/date.util';

@Component({
  standalone: true,
  selector: 'app-insights-page',
  imports: [CommonModule],
  templateUrl: './insights.page.html',
  styleUrl: './insights.page.css',
})
export class InsightsPage {
  readonly mood = inject(MoodService);

  readonly entries = this.mood.entries;
  readonly weekEntries = computed(() => lastNDays(this.entries(), 7).sort((a, b) => a.ts - b.ts));

  readonly avgScore = computed(() => {
    const w = this.weekEntries();
    if (!w.length) return 0;
    const scores = w.map(e => emojiScore(e.emoji));
    return scores.reduce((s, n) => s + n, 0) / scores.length;
  });

  readonly trend = computed(() => {
    const scores = this.weekEntries().map(e => emojiScore(e.emoji));
    return trendLabel(scores);
  });

  readonly tops = computed(() => topTags(this.weekEntries(), 6));

  readonly shareUrl = signal<string>('');

  buildShareLink(): void {
    const w = this.weekEntries();
    const payload = {
      v: 1,
      range: '7d',
      days: w.map(e => ({
        day: fmtDay(e.ts),
        emoji: e.emoji,
        tags: e.tags,
      })),
    };

    const encoded = encodePayload(payload);
    const base = location.origin + location.pathname.replace(/\/$/, '');
    this.shareUrl.set(`${base}#/share/${encoded}`);
  }

  async copyShareLink(): Promise<void> {
    if (!this.shareUrl()) this.buildShareLink();
    try {
      await navigator.clipboard.writeText(this.shareUrl());
      alert('Copied link to clipboard.');
    } catch {
      prompt('Copy this link:', this.shareUrl());
    }
  }
}
