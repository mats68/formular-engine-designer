import { TestBed } from '@angular/core/testing';

import { FormulareService } from './formulare-service.service';

describe('FormularServiceService', () => {
  let service: FormulareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
