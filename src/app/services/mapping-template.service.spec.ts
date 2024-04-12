import { TestBed } from '@angular/core/testing';

import { MappingTemplateService } from './mapping-template.service';

describe('MappingTemplateService', () => {
  let service: MappingTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappingTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
