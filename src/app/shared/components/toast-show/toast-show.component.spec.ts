import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastShowComponent } from './toast-show.component';

describe('ToastShowComponent', () => {
  let component: ToastShowComponent;
  let fixture: ComponentFixture<ToastShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
