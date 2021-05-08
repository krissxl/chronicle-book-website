import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { YearPageComponent } from './year-page.component';

describe('YearPageComponent', () => {
  let component: YearPageComponent;
  let fixture: ComponentFixture<YearPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YearPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
