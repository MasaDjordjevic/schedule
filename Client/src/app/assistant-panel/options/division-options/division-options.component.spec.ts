import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionOptionsComponent } from './division-options.component';

describe('DivisionOptionsComponent', () => {
  let component: DivisionOptionsComponent;
  let fixture: ComponentFixture<DivisionOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
