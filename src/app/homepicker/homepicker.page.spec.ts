import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepickerPage } from './homepicker.page';

describe('HomepickerPage', () => {
  let component: HomepickerPage;
  let fixture: ComponentFixture<HomepickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
