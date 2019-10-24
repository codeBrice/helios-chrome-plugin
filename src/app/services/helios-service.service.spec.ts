import { TestBed } from '@angular/core/testing';

import { HeliosServiceService } from './helios-service.service';

fdescribe('HeliosServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeliosServiceService = TestBed.get(HeliosServiceService);
    expect(service).toBeTruthy();
  });

  it('connectToFirstAvailableNode', (done) => {
    const service: HeliosServiceService = TestBed.get(HeliosServiceService);
    service.connectToFirstAvailableNode().then((result) => {
      console.log('result connectToFirstAvailableNode', result);
      expect(result).toBe(true);
      done();
    });
  });

  it('accountCreate', (done) => {
    const service: HeliosServiceService = TestBed.get(HeliosServiceService);
    let flag;
    service.accountCreate().then((result) => {
      console.log('result accountCreate', result);
      if (result) { flag = true; }
      expect(flag).toBe(true);
      done();
    });
  });

  fit('getBalance', (done) => {
    const service: HeliosServiceService = TestBed.get(HeliosServiceService);
    let flag;
    service.getBalance('0x4A1383744eED3DBE37B7A0870b15FeA3cE319A66').then((result) => {
      console.log('result getBalance', result);
      if (result) { flag = true; }
      expect(flag).toBe(true);
      done();
    });
  });

  it('getTransaction', (done) => {
    const service: HeliosServiceService = TestBed.get(HeliosServiceService);
    let flag;
    service.getTransaction('0x21da03a9cbe62f8bad58b89fd6de51b5ea2462e6bcc9dc0654871e61892d9e8b§234').then((result) => {
      console.log('result getTransaction', result);
      if (result) { flag = true; }
      expect(flag).toBe(true);
      done();
    });
  });
});
