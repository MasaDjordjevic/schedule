import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableClassComponent } from './timetable-class.component';

describe('TimetableClassComponent', () => {
  let component: TimetableClassComponent;
  let fixture: ComponentFixture<TimetableClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetableClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
