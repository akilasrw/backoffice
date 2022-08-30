import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightScheduleListComponent } from './flight-schedule-list.component';

describe('FlightScheduleListComponent', () => {
  let component: FlightScheduleListComponent;
  let fixture: ComponentFixture<FlightScheduleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightScheduleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
