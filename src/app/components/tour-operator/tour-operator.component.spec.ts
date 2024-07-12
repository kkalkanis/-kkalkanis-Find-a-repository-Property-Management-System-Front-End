import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourOperatorComponent } from './tour-operator.component';

describe('TourOperatorComponent', () => {
  let component: TourOperatorComponent;
  let fixture: ComponentFixture<TourOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
