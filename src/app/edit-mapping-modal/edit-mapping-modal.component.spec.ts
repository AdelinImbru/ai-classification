import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMappingModalComponent } from './edit-mapping-modal.component';

describe('EditMappingModalComponent', () => {
  let component: EditMappingModalComponent;
  let fixture: ComponentFixture<EditMappingModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMappingModalComponent]
    });
    fixture = TestBed.createComponent(EditMappingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
