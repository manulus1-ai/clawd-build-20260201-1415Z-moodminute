import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard.page';
import { CheckInPage } from './pages/checkin.page';
import { HistoryPage } from './pages/history.page';
import { InsightsPage } from './pages/insights.page';
import { SettingsPage } from './pages/settings.page';
import { SharePage } from './pages/share.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardPage },
  { path: 'check-in', component: CheckInPage },
  { path: 'history', component: HistoryPage },
  { path: 'insights', component: InsightsPage },
  { path: 'settings', component: SettingsPage },
  { path: 'share/:payload', component: SharePage },
  { path: '**', redirectTo: '' },
];
