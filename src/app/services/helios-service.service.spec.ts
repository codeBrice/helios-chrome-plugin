import { TestBed } from '@angular/core/testing';

import { HeliosServiceService } from './helios-service.service';

fdescribe('HeliosServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  fit('should be created', () => {
    const service: HeliosServiceService = TestBed.get(HeliosServiceService);
    expect(service).toBeTruthy();
  });

  fit('connectToFirstAvailableNode', (done) => {
    const service: HeliosServiceService = TestBed.get(HeliosServiceService);
    service.connectToFirstAvailableNode().then((result) => {
      console.log('result connectToFirstAvailableNode', result);
      expect(result).toBe(true);
      done();
    });
  });

});
