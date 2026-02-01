import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MoodService } from '../core/mood.service';
import { fmtDay } from '../core/date.util';
import { emojiScore, lastNDays } from '../core/insights.util';

@Component({
  standalone: true,
  selector: 'app-dashboard-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private readonly mood = inject(MoodService);

  readonly today = computed(() => this.mood.entryForToday());
  readonly streak = computed(() => this.mood.streakDays());

  readonly entries = this.mood.entries;
  readonly week = computed(() => lastNDays(this.entries(), 7).sort((a, b) => a.ts - b.ts));

  readonly weekBars = computed(() => {
    const week = this.week();
    if (week.length === 0) return [] as Array<{ label: string; score: number; emoji: string }>;
    return week.map(e => ({
      label: fmtDay(e.ts),
      score: emojiScore(e.emoji) / 5,
      emoji: e.emoji,
    }));
  });

  readonly checkinsThisWeek = computed(() => this.week().length);
}
