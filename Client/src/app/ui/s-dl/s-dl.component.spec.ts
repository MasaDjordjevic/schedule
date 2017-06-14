import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SDlComponent } from './s-dl.component';

describe('SDlComponent', () => {
  let component: SDlComponent;
  let fixture: ComponentFixture<SDlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SDlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SDlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
