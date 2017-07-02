import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelClassComponent } from './cancel-class.component';

describe('CancelClassComponent', () => {
  let component: CancelClassComponent;
  let fixture: ComponentFixture<CancelClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
