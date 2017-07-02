import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AssistantPanelRoutingModule} from './assistant-panel-routing.module';
import {AssistantPanelComponent} from './assistant-panel/assistant-panel.component';
import {HeaderModule} from '../header/header.module';
import {SharedModule} from '../shared/shared.module';
import {DepartmentsListComponent} from './departments-list/departments-list.component';
import {UiModule} from '../ui/ui.module';
import {DepartmentsService} from './services/departments.service';
import {DivisionsListComponent} from './divisions-list/divisions-list.component';
import {DivisionsService} from './services/divisions.service';
import {GroupsListComponent} from './groups-list/groups-list.component';
import {GroupsService} from './services/groups.service';
import {StudentsListComponent} from './students-list/students-list.component';
import {StudentsService} from './services/students.service';
import {PanelOptionsComponent} from './options/panel-options/panel-options.component';
import {DepartmentOptionsComponent} from './options/department-options/department-options.component';
import {DivisionOptionsComponent} from './options/division-options/division-options.component';
import {GroupOptionsComponent} from './options/group-options/group-options.component';
import {StudentOptionsComponent} from './options/student-options/student-options.component';
import {ThemeService} from './services/theme.service';
import {StudentFinderComponent} from './dialogs/student-finder/student-finder.component';
import {FormsModule} from '@angular/forms';
import {DivisionCreatorComponent} from './dialogs/division-creator/division-creator.component';
import {CoursesService} from './services/courses.service';
import {DeleteDivisionComponent} from './dialogs/delete-division/delete-division.component';
import {MassGroupEditComponent} from './dialogs/mass-group-edit/mass-group-edit.component';
import {ExportDivisionComponent} from './dialogs/export-division/export-division.component';
import {EditDivisionComponent} from './dialogs/edit-division/edit-division.component';
import {EditGroupComponent} from './dialogs/edit-group/edit-group.component';
import {AssistantsService} from './services/assistants.service';
import {ClassroomsService} from './services/classrooms.service';
import {DeleteGroupComponent} from './dialogs/delete-group/delete-group.component';
import { AddAnnouncementComponent } from './dialogs/add-announcement/add-announcement.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HeaderModule,
    UiModule,
    FormsModule,
    AssistantPanelRoutingModule
  ],
  entryComponents: [StudentFinderComponent, DivisionCreatorComponent, DeleteDivisionComponent,
    MassGroupEditComponent, ExportDivisionComponent, EditDivisionComponent, EditGroupComponent,
    DeleteGroupComponent, AddAnnouncementComponent],
  declarations: [AssistantPanelComponent, DepartmentsListComponent,
    DivisionsListComponent, GroupsListComponent, StudentsListComponent,
    PanelOptionsComponent, DepartmentOptionsComponent, DivisionOptionsComponent,
    GroupOptionsComponent, StudentOptionsComponent, StudentFinderComponent, DivisionCreatorComponent, DeleteDivisionComponent,
    MassGroupEditComponent, ExportDivisionComponent, EditDivisionComponent, EditGroupComponent, DeleteGroupComponent, AddAnnouncementComponent],
  providers: [DepartmentsService, DivisionsService, GroupsService,
    StudentsService, ThemeService, CoursesService, AssistantsService, ClassroomsService]
})
export class AssistantPanelModule {
}
