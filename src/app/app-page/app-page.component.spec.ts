import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppPageComponent } from './app-page.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppPageComponent', () => {
  let component: AppPageComponent;
  let fixture: ComponentFixture<AppPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppPageComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
