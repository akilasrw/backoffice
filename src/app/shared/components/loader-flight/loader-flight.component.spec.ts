import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderFlightComponent } from './loader-flight.component';

describe('LoaderFlightComponent', () => {
  let component: LoaderFlightComponent;
  let fixture: ComponentFixture<LoaderFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaderFlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
