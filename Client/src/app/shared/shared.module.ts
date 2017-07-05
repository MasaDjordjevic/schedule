import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {
  MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdMenuModule, MdIconModule,
  MdDialogModule, MdAutocompleteModule, MdDatepickerModule, MdNativeDateModule, MdTooltipModule, MdSnackBar,
  MdSnackBarModule, MdTabsModule
} from '@angular/material';
import {ThemeService} from './theme.service';
import {DepartmentsService} from './services/departments.service';
import {DivisionsService} from './services/divisions.service';
import {GroupsService} from './services/groups.service';
import {ClassroomsService} from './services/classrooms.service';
import {AssistantsService} from './services/assistants.service';
import {CoursesService} from './services/courses.service';
import {StudentsService} from './services/students.service';


@NgModule({
  providers: [ThemeService, DepartmentsService, DivisionsService, GroupsService,
    StudentsService, CoursesService, AssistantsService, ClassroomsService],
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
  ]
})
export class SharedModule {
}
