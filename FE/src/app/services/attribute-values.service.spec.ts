import { TestBed } from '@angular/core/testing';

import { AttributeValuesService } from './attribute-values.service';

describe('AttributeValuesService', () => {
  let service: AttributeValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
