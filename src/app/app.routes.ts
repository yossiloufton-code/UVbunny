import { Routes } from '@angular/router';
import { BunnyDashboard } from './pages/bunny-dashboard/bunny-dashboard';
import { BunnyDetails } from './pages/bunny-details/bunny-details';
import { Config } from './pages/config/config';

export const routes: Routes = [
  { path: '', redirectTo: 'bunnies', pathMatch: 'full' },
  { path: 'bunnies', component: BunnyDashboard },
  { path: 'bunnies/:id', component: BunnyDetails },
  { path: 'config', component: Config },
  { path: '**', redirectTo: 'bunnies' },
];
