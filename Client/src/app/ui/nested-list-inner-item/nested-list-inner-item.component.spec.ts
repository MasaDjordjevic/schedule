import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NesteListInnerItemComponent } from './neste-list-inner-item.component';

describe('NesteListInnerItemComponent', () => {
  let component: NesteListInnerItemComponent;
  let fixture: ComponentFixture<NesteListInnerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NesteListInnerItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NesteListInnerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
