import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantPanelRoutingModule } from './assistant-panel-routing.module';
import { AssistantPanelComponent } from './assistant-panel/assistant-panel.component';
import {HeaderModule} from '../header/header.module';
import {SharedModule} from '../shared/shared.module';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import {UiModule} from '../ui/ui.module';
import {DepartmentsService} from './services/departments.service';
import { DivisionsListComponent } from './divisions-list/divisions-list.component';
import {DivisionsService} from './services/divisions.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HeaderModule,
    UiModule,
    AssistantPanelRoutingModule
  ],
  declarations: [AssistantPanelComponent, DepartmentsListComponent, DivisionsListComponent],
  providers: [DepartmentsService, DivisionsService]
})
export class AssistantPanelModule { }
