import { TestBed } from '@angular/core/testing';

import { TourContractService } from './tour-contract.service';

describe('TourContractService', () => {
  let service: TourContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
