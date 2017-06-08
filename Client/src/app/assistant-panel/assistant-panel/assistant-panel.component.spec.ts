import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantPanelComponent } from './assistant-panel.component';

describe('AssistantPanelComponent', () => {
  let component: AssistantPanelComponent;
  let fixture: ComponentFixture<AssistantPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
