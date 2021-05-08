import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryPageComponent } from './entry-page.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EntryPageComponent', () => {
  let component: EntryPageComponent;
  let fixture: ComponentFixture<EntryPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EntryPageComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
