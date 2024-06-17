import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAttributeModalComponent } from './create-attribute-modal.component';

describe('CreateAttributeModalComponent', () => {
  let component: CreateAttributeModalComponent;
  let fixture: ComponentFixture<CreateAttributeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAttributeModalComponent]
    });
    fixture = TestBed.createComponent(CreateAttributeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
