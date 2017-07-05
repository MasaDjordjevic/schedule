import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentPanelRoutingModule } from './student-panel-routing.module';
import {StudentPanelComponent} from './student-panel/student-panel.component';
import {SharedModule} from '../shared/shared.module';
import {HeaderModule} from '../header/header.module';
import {TimetableModule} from '../timetable/timetable.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HeaderModule,
    TimetableModule,
    StudentPanelRoutingModule
  ],
  declarations: [StudentPanelComponent]
})
export class StudentPanelModule { }
