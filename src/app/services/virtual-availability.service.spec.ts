import { TestBed } from '@angular/core/testing';

import { VirtualAvailabilityService } from './virtual-availability.service';

describe('VirtualAvailabilityService', () => {
  let service: VirtualAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
