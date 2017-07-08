import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableDialogComponent } from './timetable-dialog.component';

describe('TimetableDialogComponent', () => {
  let component: TimetableDialogComponent;
  let fixture: ComponentFixture<TimetableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
