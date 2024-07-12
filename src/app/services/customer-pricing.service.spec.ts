import { TestBed } from '@angular/core/testing';

import { CustomerPricingService } from './customer-pricing.service';

describe('CustomerPricingService', () => {
  let service: CustomerPricingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerPricingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
