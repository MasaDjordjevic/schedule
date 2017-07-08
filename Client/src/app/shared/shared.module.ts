import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {
  MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdMenuModule, MdIconModule,
  MdDialogModule, MdAutocompleteModule, MdDatepickerModule, MdNativeDateModule, MdTooltipModule, MdSnackBar,
  MdSnackBarModule, MdTabsModule, MdProgressSpinnerModule, MdRadioModule
} from '@angular/material';
import {ThemeService} from './theme.service';
import {DepartmentsService} from './services/departments.service';
import {DivisionsService} from './services/divisions.service';
import {GroupsService} from './services/groups.service';
import {ClassroomsService} from './services/classrooms.service';
import {AssistantsService} from './services/assistants.service';
import {CoursesService} from './services/courses.service';
import {StudentsService} from './services/students.service';
import {RefreshTimetableService} from './refresh-timetable.service';


@NgModule({
  providers: [ThemeService, DepartmentsService, DivisionsService, GroupsService,
    StudentsService, CoursesService, AssistantsService, ClassroomsService, RefreshTimetableService],
  exports: [
    TranslateModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdSelectModule,
    MdMenuModule,
    MdIconModule,
    MdDialogModule,
    MdAutocompleteModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdTooltipModule,
    MdSnackBarModule,
    MdTabsModule,
    MdProgressSpinnerModule,
    MdRadioModule,
  ]
})
export class SharedModule {
}
