import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAvailabilityComponent } from './type-availability.component';

describe('TypeAvailabilityComponent', () => {
  let component: TypeAvailabilityComponent;
  let fixture: ComponentFixture<TypeAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
