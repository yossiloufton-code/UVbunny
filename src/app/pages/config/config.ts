import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { GlobalConfig } from '../../models/global-config';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.html',
  styleUrl: './config.scss',
})
export class Config implements OnInit {
  config$!: Observable<GlobalConfig>;
  currentValue = 3;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.config$ = this.configService.getConfig();

    this.config$.subscribe(c => {
      if (c?.pointsPerCarrot != null) {
        this.currentValue = c.pointsPerCarrot;
      }
    });
  }

  async onSave() {
    try {
      await this.configService.updatePointsPerCarrot(this.currentValue);
      this.toast.success('Updated points per carrot');
      await this.router.navigate(['/bunnies']);
    } catch (err) {
      console.error(err);
      this.toast.error('Failed to update configuration');
    }
  }
}
