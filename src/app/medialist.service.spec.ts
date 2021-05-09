import { TestBed } from '@angular/core/testing';

import { MediaListService } from './medialist.service';

describe('MedialistService', () => {
  let service: MediaListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
