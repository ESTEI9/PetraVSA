import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierDashPage } from './cashier-dash.page';

describe('CashierDashPage', () => {
  let component: CashierDashPage;
  let fixture: ComponentFixture<CashierDashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashierDashPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierDashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
