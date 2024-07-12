import { TestBed } from '@angular/core/testing';

import { HotelSpecificsService } from './hotel-specifics.service';

describe('HotelSpecificsService', () => {
  let service: HotelSpecificsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelSpecificsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
