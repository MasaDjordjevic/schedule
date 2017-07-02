import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsSelectorComponent } from './students-selector.component';

describe('StudentsSelectorComponent', () => {
  let component: StudentsSelectorComponent;
  let fixture: ComponentFixture<StudentsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
