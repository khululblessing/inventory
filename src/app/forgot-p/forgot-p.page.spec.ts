import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPPage } from './forgot-p.page';

describe('ForgotPPage', () => {
  let component: ForgotPPage;
  let fixture: ComponentFixture<ForgotPPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
