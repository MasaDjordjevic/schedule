import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedListInnerComponent } from './nested-list-inner.component';

describe('NestedListInnerComponent', () => {
  let component: NestedListInnerComponent;
  let fixture: ComponentFixture<NestedListInnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestedListInnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedListInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
