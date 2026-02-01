import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { decodePayload } from '../core/share.util';
import { emojiScore } from '../core/insights.util';

@Component({
  standalone: true,
  selector: 'app-share-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './share.page.html',
  styleUrl: './share.page.css',
})
export class SharePage {
  readonly payload = computed(() => {
    const p = this.route.snapshot.paramMap.get('payload');
    if (!p) return null;
    try {
      return decodePayload(p);
    } catch {
      return null;
    }
  });

  readonly days = computed(() => {
    const payload = this.payload();
    const days = payload?.days;
    if (!Array.isArray(days)) return [] as Array<{ day: string; emoji: string; score: number; tags: string[] }>;
    return days.slice(0, 14).map((d: any) => ({
      day: String(d.day ?? ''),
      emoji: String(d.emoji ?? '😐'),
      score: emojiScore(String(d.emoji ?? '😐') as any) / 5,
      tags: Array.isArray(d.tags) ? d.tags.map((t: any) => String(t)).slice(0, 8) : [],
    }));
  });

  constructor(private readonly route: ActivatedRoute) {}
}
