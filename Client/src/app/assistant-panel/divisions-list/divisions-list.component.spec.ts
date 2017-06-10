import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionsListComponent } from './divisions-list.component';

describe('DivisionsListComponent', () => {
  let component: DivisionsListComponent;
  let fixture: ComponentFixture<DivisionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivisionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
