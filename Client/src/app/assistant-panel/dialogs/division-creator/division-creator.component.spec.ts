import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionCreatorComponent } from './division-creator.component';

describe('DivisionCreatorComponent', () => {
  let component: DivisionCreatorComponent;
  let fixture: ComponentFixture<DivisionCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
