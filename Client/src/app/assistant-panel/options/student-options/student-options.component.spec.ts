import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentOptionsComponent } from './student-options.component';

describe('StudentOptionsComponent', () => {
  let component: StudentOptionsComponent;
  let fixture: ComponentFixture<StudentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
