import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaptureInventoryPage } from './capture-inventory.page';

describe('CaptureInventoryPage', () => {
  let component: CaptureInventoryPage;
  let fixture: ComponentFixture<CaptureInventoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
