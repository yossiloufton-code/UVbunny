import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { GlobalConfig } from '../../models/global-config';
import { Observable } from 'rxjs';

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

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.config$ = this.configService.getConfig();

    this.config$.subscribe(c => {
      if (c?.pointsPerCarrot != null) {
        this.currentValue = c.pointsPerCarrot;
      }
    });
  }

  onSave() {
    void this.configService.updatePointsPerCarrot(this.currentValue);
  }
}
