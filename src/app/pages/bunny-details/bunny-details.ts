import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BunnyService } from '../../services/bunny.service';
import { ConfigService } from '../../services/config.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Bunny } from '../../models/bunny';
import { GlobalConfig } from '../../models/global-config';

interface DetailsVM {
  bunny: Bunny;
  config: GlobalConfig;
  happiness: number;
}

@Component({
  selector: 'app-bunny-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bunny-details.html',
  styleUrl: './bunny-details.scss',
})
export class BunnyDetails {
  vm$!: Observable<DetailsVM>;
  private bunnyId: string;

  constructor(
    private route: ActivatedRoute,
    private bunnyService: BunnyService,
    private configService: ConfigService
  ) {
    this.bunnyId = this.route.snapshot.paramMap.get('id')!;

    this.vm$ = combineLatest([
      this.bunnyService.getBunny(this.bunnyId),
      this.configService.getConfig(),
    ]).pipe(
      map(([bunny, config]) => {
        if (!bunny) {
          throw new Error('Bunny not found');
        }
        const happiness = (bunny.carrots ?? 0) * (config.pointsPerCarrot ?? 3);
        return { bunny, config, happiness };
      })
    );
  }

  giveCarrot() {
    void this.bunnyService.giveCarrot(this.bunnyId, 1);
  }
}
