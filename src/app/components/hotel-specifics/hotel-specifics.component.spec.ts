import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSpecificsComponent } from './hotel-specifics.component';

describe('HotelSpecificsComponent', () => {
  let component: HotelSpecificsComponent;
  let fixture: ComponentFixture<HotelSpecificsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelSpecificsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSpecificsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
