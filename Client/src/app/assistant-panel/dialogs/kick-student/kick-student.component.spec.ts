import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KickStudentComponent } from './kick-student.component';

describe('KickStudentComponent', () => {
  let component: KickStudentComponent;
  let fixture: ComponentFixture<KickStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KickStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KickStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
