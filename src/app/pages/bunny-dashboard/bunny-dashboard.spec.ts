import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BunnyDashboard } from './bunny-dashboard';

describe('BunnyDashboard', () => {
  let component: BunnyDashboard;
  let fixture: ComponentFixture<BunnyDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BunnyDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BunnyDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
