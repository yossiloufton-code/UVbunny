import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BunnyService } from '../../services/bunny.service';
import { ConfigService } from '../../services/config.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Bunny } from '../../models/bunny';
import { GlobalConfig } from '../../models/global-config';
import { BunnyEvent } from '../../models/bunny-event';
import { ToastService } from '../../services/toast.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface DetailsVM {
  bunny: Bunny;
  config: GlobalConfig;
  happiness: number;
  events: BunnyEvent[];
}

@Component({
  selector: 'app-bunny-details',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './bunny-details.html',
  styleUrl: './bunny-details.scss',
})
export class BunnyDetails {
  vm$!: Observable<DetailsVM>;
  private bunnyId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bunnyService: BunnyService,
    private configService: ConfigService,
    private toast: ToastService
  ) {
    this.bunnyId = this.route.snapshot.paramMap.get('id')!;

    this.vm$ = combineLatest([
      this.bunnyService.getBunny(this.bunnyId),
      this.configService.getConfig(),
      this.bunnyService.getEventsForBunny(this.bunnyId),
    ]).pipe(
      map(([bunny, config, events]) => {
        if (!bunny) {
          throw new Error('Bunny not found');
        }
        const happiness = (bunny.carrots ?? 0) * (config.pointsPerCarrot ?? 3);
        return { bunny, config, happiness, events };
      })
    );
  }

  async giveCarrot() {
    try {
      await this.bunnyService.giveCarrot(this.bunnyId, 1);
      this.toast.success('You gave your bunny a carrot! 🥕');
    } catch (err) {
      console.error(err);
      this.toast.error('Failed to give carrot');
    }
  }

  async deleteBunny() {
    const confirmed = window.confirm('Are you sure you want to remove this bunny?');
    if (!confirmed) return;

    try {
      await this.bunnyService.deleteBunny(this.bunnyId);
      this.toast.success('Bunny removed');
      await this.router.navigate(['/bunnies']);
    } catch (err) {
      console.error(err);
      this.toast.error('Failed to delete bunny');
    }
  }
}
