import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TimetableRoutingModule} from './timetable-routing.module';
import {TimetableComponent} from './timetable/timetable.component';
import {ToTimestampPipe} from './to-timestamp.pipe';
import {SharedModule} from '../shared/shared.module';
import {TimetableColumnComponent} from './timetable-column/timetable-column.component';
import {TimetableClassComponent} from './timetable-class/timetable-class.component';
import {ClassDetailsComponent} from './dialogs/class-details/class-details.component';
import {AddTaskComponent} from './dialogs/add-task/add-task.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    TimetableRoutingModule
  ],
  entryComponents: [ClassDetailsComponent, AddTaskComponent],
  declarations: [TimetableComponent, ToTimestampPipe, TimetableColumnComponent,
    TimetableClassComponent, ClassDetailsComponent, AddTaskComponent],
  exports: [TimetableComponent]
})
export class TimetableModule {
}
