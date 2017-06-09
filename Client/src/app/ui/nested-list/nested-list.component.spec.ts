import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedListComponent } from './nested-list.component';

describe('NestedListComponent', () => {
  let component: NestedListComponent;
  let fixture: ComponentFixture<NestedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
