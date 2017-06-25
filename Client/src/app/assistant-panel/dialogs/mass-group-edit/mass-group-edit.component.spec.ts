import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassGroupEditComponent } from './mass-group-edit.component';

describe('MassGroupEditComponent', () => {
  let component: MassGroupEditComponent;
  let fixture: ComponentFixture<MassGroupEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassGroupEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
