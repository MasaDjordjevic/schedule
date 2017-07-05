import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimetableRoutingModule } from './timetable-routing.module';
import { TimetableComponent } from './timetable/timetable.component';
import { ToTimestampPipe } from './to-timestamp.pipe';
import {SharedModule} from '../shared/shared.module';
import { TimetableColumnComponent } from './timetable-column/timetable-column.component';
import { TimetableClassComponent } from './timetable-class/timetable-class.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TimetableRoutingModule
  ],
  declarations: [TimetableComponent, ToTimestampPipe, TimetableColumnComponent, TimetableClassComponent],
  exports: [TimetableComponent]
})
export class TimetableModule { }
