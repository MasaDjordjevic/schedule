import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFinderComponent } from './student-finder.component';

describe('StudentFinderComponent', () => {
  let component: StudentFinderComponent;
  let fixture: ComponentFixture<StudentFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
