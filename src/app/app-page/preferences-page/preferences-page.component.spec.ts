import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreferencesPageComponent } from './preferences-page.component';

describe('PreferencesPageComponent', () => {
  let component: PreferencesPageComponent;
  let fixture: ComponentFixture<PreferencesPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferencesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
