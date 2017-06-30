import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDivisionComponent } from './export-division.component';

describe('ExportDivisionComponent', () => {
  let component: ExportDivisionComponent;
  let fixture: ComponentFixture<ExportDivisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportDivisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
