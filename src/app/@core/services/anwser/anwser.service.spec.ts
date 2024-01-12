import { TestBed } from '@angular/core/testing';

import { AnwserService } from './anwser.service';

describe('AnwserService', () => {
  let service: AnwserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnwserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
