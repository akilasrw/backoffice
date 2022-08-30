import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightScheduleCreateComponent } from './flight-schedule-create.component';

describe('FlightScheduleCreateComponent', () => {
  let component: FlightScheduleCreateComponent;
  let fixture: ComponentFixture<FlightScheduleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightScheduleCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightScheduleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
