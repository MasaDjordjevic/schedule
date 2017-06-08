import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AssistantPanelComponent} from './assistant-panel/assistant-panel.component';

const routes: Routes = [
  {
    path: '', component: AssistantPanelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistantPanelRoutingModule { }
