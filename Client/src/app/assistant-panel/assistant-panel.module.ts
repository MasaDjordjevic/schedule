import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantPanelRoutingModule } from './assistant-panel-routing.module';
import { AssistantPanelComponent } from './assistant-panel/assistant-panel.component';
import {HeaderModule} from '../header/header.module';
import {SharedModule} from '../shared/shared.module';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import {UiModule} from '../ui/ui.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HeaderModule,
    UiModule,
    AssistantPanelRoutingModule
  ],
  declarations: [AssistantPanelComponent, DepartmentsListComponent]
})
export class AssistantPanelModule { }
