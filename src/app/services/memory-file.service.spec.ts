import { TestBed } from '@angular/core/testing';

import { MemoryFileService } from './memory-file.service';

describe('MemoryFileService', () => {
  let service: MemoryFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
