import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimetableRoutingModule } from './timetable-routing.module';
import { TimetableComponent } from './timetable/timetable.component';
import { ToTimestampPipe } from './to-timestamp.pipe';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TimetableRoutingModule
  ],
  declarations: [TimetableComponent, ToTimestampPipe],
  exports: [TimetableComponent]
})
export class TimetableModule { }
