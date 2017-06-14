import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentOptionsComponent } from './department-options.component';

describe('DepartmentOptionsComponent', () => {
  let component: DepartmentOptionsComponent;
  let fixture: ComponentFixture<DepartmentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
