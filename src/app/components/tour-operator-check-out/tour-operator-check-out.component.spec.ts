import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourOperatorCheckOutComponent } from './tour-operator-check-out.component';

describe('TourOperatorCheckOutComponent', () => {
  let component: TourOperatorCheckOutComponent;
  let fixture: ComponentFixture<TourOperatorCheckOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourOperatorCheckOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourOperatorCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
