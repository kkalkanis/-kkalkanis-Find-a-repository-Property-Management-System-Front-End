import { TestBed } from '@angular/core/testing';

import { CheckOutOperatorService } from './check-out-operator.service';

describe('CheckOutOperatorService', () => {
  let service: CheckOutOperatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckOutOperatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
