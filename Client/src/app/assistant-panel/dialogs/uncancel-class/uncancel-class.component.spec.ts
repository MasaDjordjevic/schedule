import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncancelClassComponent } from './uncancel-class.component';

describe('UncancelClassComponent', () => {
  let component: UncancelClassComponent;
  let fixture: ComponentFixture<UncancelClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncancelClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncancelClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
