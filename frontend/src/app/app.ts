import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MoodService } from './core/mood.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly mood = inject(MoodService);

  readonly settings = this.mood.settings;
  readonly reduceMotion = computed(() => this.settings().reduceMotion);
  readonly highContrast = computed(() => this.settings().highContrast);

  constructor() {
    effect(() => {
      const reduceMotion = this.reduceMotion();
      const highContrast = this.highContrast();

      document.documentElement.classList.toggle('reduce-motion', reduceMotion);
      document.documentElement.classList.toggle('high-contrast', highContrast);
    });
  }
}
