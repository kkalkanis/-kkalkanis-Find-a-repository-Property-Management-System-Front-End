import { TestBed } from '@angular/core/testing';

import { TourOperatorService } from './tour-operator.service';

describe('TourOperatorService', () => {
  let service: TourOperatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourOperatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
