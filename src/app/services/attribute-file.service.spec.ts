import { TestBed } from '@angular/core/testing';

import { AttributeFileService } from './attribute-file.service';

describe('AttributeFileService', () => {
  let service: AttributeFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
