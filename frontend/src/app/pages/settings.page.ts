import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoodService } from '../core/mood.service';

@Component({
  standalone: true,
  selector: 'app-settings-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css',
})
export class SettingsPage {
  private readonly mood = inject(MoodService);

  readonly settings = this.mood.settings;

  readonly importText = signal('');
  readonly importResult = signal<string>('');

  readonly entryCount = computed(() => this.mood.entries().length);

  toggleReduceMotion(): void {
    this.mood.setSettings({ reduceMotion: !this.settings().reduceMotion });
  }

  toggleHighContrast(): void {
    this.mood.setSettings({ highContrast: !this.settings().highContrast });
  }

  downloadExport(): void {
    const bundle = this.mood.exportBundle();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `moodminute-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  runImport(): void {
    const res = this.mood.importBundle(this.importText());
    this.importResult.set(res.ok ? `Imported ${res.imported} entries.` : res.error);
  }
}
