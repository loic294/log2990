import { TestBed, inject } from '@angular/core/testing';

import { ModeService } from './mode.service';

describe('ModeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModeService]
    });
  });

  it('should be created', inject([ModeService], (service: ModeService) => {
    expect(service).toBeTruthy();
  }));
});
