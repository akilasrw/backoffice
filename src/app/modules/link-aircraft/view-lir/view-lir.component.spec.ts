import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLirComponent } from './view-lir.component';

describe('ViewLirComponent', () => {
  let component: ViewLirComponent;
  let fixture: ComponentFixture<ViewLirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
