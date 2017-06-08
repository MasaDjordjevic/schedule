import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantPanelRoutingModule } from './assistant-panel-routing.module';
import { AssistantPanelComponent } from './assistant-panel/assistant-panel.component';
import {HeaderModule} from '../header/header.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HeaderModule,
    AssistantPanelRoutingModule
  ],
  declarations: [AssistantPanelComponent]
})
export class AssistantPanelModule { }
