import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbSetupComponent } from './db-setup.component';

describe('DbSetupComponent', () => {
  let component: DbSetupComponent;
  let fixture: ComponentFixture<DbSetupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DbSetupComponent]
    });
    fixture = TestBed.createComponent(DbSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
