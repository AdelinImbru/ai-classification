import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMappingTemplateModalComponent } from './create-mapping-template-modal.component';

describe('CreateMappingTemplateModalComponent', () => {
  let component: CreateMappingTemplateModalComponent;
  let fixture: ComponentFixture<CreateMappingTemplateModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMappingTemplateModalComponent]
    });
    fixture = TestBed.createComponent(CreateMappingTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
