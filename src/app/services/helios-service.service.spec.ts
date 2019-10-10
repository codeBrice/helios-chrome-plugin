import { TestBed } from '@angular/core/testing';

import { HeliosServiceService } from './helios-service.service';

describe('HeliosServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeliosServiceService = TestBed.get(HeliosServiceService);
    expect(service).toBeTruthy();
  });
});
