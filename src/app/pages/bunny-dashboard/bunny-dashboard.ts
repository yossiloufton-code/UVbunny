import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BunnyService } from '../../services/bunny.service';
import { ConfigService } from '../../services/config.service';
import { Bunny } from '../../models/bunny';
import { GlobalConfig } from '../../models/global-config';
import { combineLatest, map, Observable } from 'rxjs';
import { ToastService } from '../../services/toast.service';

interface BunnyView {
  bunny: Bunny;
  happiness: number;
}

interface DashboardVM {
  bunnies: BunnyView[];
  averageHappiness: number;
  config: GlobalConfig;
}

@Component({
  selector: 'app-bunny-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bunny-dashboard.html',
  styleUrl: './bunny-dashboard.scss',
})
export class BunnyDashboard {
  vm$: Observable<DashboardVM>;
  newBunnyName = '';

  constructor(
    private bunnyService: BunnyService,
    private configService: ConfigService,
    private router: Router,
    private toast: ToastService
  ) {
    this.vm$ = combineLatest([
      this.bunnyService.getBunnies(),
      this.configService.getConfig(),
    ]).pipe(
      map(([bunnies, config]) => {
        const safeConfig: GlobalConfig = config ?? { pointsPerCarrot: 3 };

        const bunnyViews: BunnyView[] = bunnies.map(b => ({
          bunny: b,
          happiness: (b.carrots ?? 0) * (safeConfig.pointsPerCarrot ?? 3),
        }));

        const total = bunnyViews.reduce((sum, b) => sum + b.happiness, 0);
        const avg = bunnyViews.length ? total / bunnyViews.length : 0;

        return {
          bunnies: bunnyViews,
          averageHappiness: avg,
          config: safeConfig,
        };
      })
    );
  }

  async addBunny() {
    const name = this.newBunnyName.trim();
    if (!name) return;

    try {
      const ref = await this.bunnyService.addBunny(name);
      this.newBunnyName = '';

      this.toast.success(`Bunny "${name}" added 🐰`);
      await this.router.navigate(['/bunnies', ref.id]);
    } catch (err) {
      console.error(err);
      this.toast.error('Failed to add bunny');
    }
  }

  openDetails(id: string) {
    void this.router.navigate(['/bunnies', id]);
  }
}
