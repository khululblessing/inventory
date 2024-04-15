import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickerPage } from './picker.page';

describe('PickerPage', () => {
  let component: PickerPage;
  let fixture: ComponentFixture<PickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
