import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UldCreateComponent } from './uld-create.component';

describe('UldCreateComponent', () => {
  let component: UldCreateComponent;
  let fixture: ComponentFixture<UldCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UldCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UldCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
