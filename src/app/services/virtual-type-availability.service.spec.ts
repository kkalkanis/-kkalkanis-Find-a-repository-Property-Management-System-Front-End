import { TestBed } from '@angular/core/testing';

import { VirtualTypeAvailabilityService } from './virtual-type-availability.service';

describe('VirtualTypeAvailabilityService', () => {
  let service: VirtualTypeAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualTypeAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
