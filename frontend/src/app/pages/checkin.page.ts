import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MoodService } from '../core/mood.service';
import { MoodEmoji } from '../core/mood.model';

const EMOJIS: MoodEmoji[] = ['😞', '😕', '😐', '🙂', '😁'];
const SUGGESTED_TAGS = ['sleep', 'work', 'friends', 'family', 'health', 'exercise', 'food', 'stress', 'calm', 'focus', 'outside'];

@Component({
  standalone: true,
  selector: 'app-checkin-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkin.page.html',
  styleUrl: './checkin.page.css',
})
export class CheckInPage {
  private readonly mood = inject(MoodService);
  private readonly router = inject(Router);

  readonly emojis = EMOJIS;
  readonly suggestedTags = SUGGESTED_TAGS;

  readonly selectedEmoji = signal<MoodEmoji>('🙂');
  readonly selectedTags = signal<string[]>([]);
  readonly note = signal('');

  readonly canSave = computed(() => !!this.selectedEmoji());

  toggleTag(tag: string): void {
    const next = new Set(this.selectedTags());
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    this.selectedTags.set([...next]);
  }

  save(): void {
    if (!this.canSave()) return;
    this.mood.addEntry({
      emoji: this.selectedEmoji(),
      tags: this.selectedTags(),
      note: this.note(),
    });
    this.router.navigateByUrl('/');
  }
}
