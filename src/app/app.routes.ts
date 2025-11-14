import { Routes } from '@angular/router';
import { BunnyDashboard } from './pages/bunny-dashboard/bunny-dashboard';
import { BunnyDetails } from './pages/bunny-details/bunny-details';
import { Config } from './pages/config/config';

export const routes: Routes = [
  { path: '', redirectTo: 'bunnies', pathMatch: 'full' },

  // Main page (dashboard)
  { path: 'bunnies', component: BunnyDashboard },

  // Bunny details page
  { path: 'bunnies/:id', component: BunnyDetails },

  // Config page
  { path: 'config', component: Config },

  // Fallback
  { path: '**', redirectTo: 'bunnies' },
];
