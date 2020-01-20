import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityModalPage } from './security-modal.page';

describe('SecurityModalPage', () => {
  let component: SecurityModalPage;
  let fixture: ComponentFixture<SecurityModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
