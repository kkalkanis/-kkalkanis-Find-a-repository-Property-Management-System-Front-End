import { TestBed } from '@angular/core/testing';

import { TypeAvailabilityService } from './type-availability.service';

describe('TypeAvailabilityService', () => {
  let service: TypeAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
