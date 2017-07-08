import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AssistantPanelRoutingModule} from './assistant-panel-routing.module';
import {AssistantPanelComponent} from './assistant-panel/assistant-panel.component';
import {HeaderModule} from '../header/header.module';
import {SharedModule} from '../shared/shared.module';
import {DepartmentsListComponent} from './departments-list/departments-list.component';
import {UiModule} from '../ui/ui.module';
import {DivisionsListComponent} from './divisions-list/divisions-list.component';
import {GroupsListComponent} from './groups-list/groups-list.component';
import {StudentsListComponent} from './students-list/students-list.component';
import {PanelOptionsComponent} from './options/panel-options/panel-options.component';
import {DepartmentOptionsComponent} from './options/department-options/department-options.component';
import {DivisionOptionsComponent} from './options/division-options/division-options.component';
import {GroupOptionsComponent} from './options/group-options/group-options.component';
import {StudentOptionsComponent} from './options/student-options/student-options.component';
import {StudentFinderComponent} from './dialogs/student-finder/student-finder.component';
import {FormsModule} from '@angular/forms';
import {DivisionCreatorComponent} from './dialogs/division-creator/division-creator.component';
import {DeleteDivisionComponent} from './dialogs/delete-division/delete-division.component';
import {MassGroupEditComponent} from './dialogs/mass-group-edit/mass-group-edit.component';
import {ExportDivisionComponent} from './dialogs/export-division/export-division.component';
import {EditDivisionComponent} from './dialogs/edit-division/edit-division.component';
import {EditGroupComponent} from './dialogs/edit-group/edit-group.component';
import {DeleteGroupComponent} from './dialogs/delete-group/delete-group.component';
import {AddAnnouncementComponent} from './dialogs/add-announcement/add-announcement.component';
import {CancelClassComponent} from './dialogs/cancel-class/cancel-class.component';
import {AddActivityComponent} from './dialogs/add-activity/add-activity.component';
import {KickStudentComponent} from './dialogs/kick-student/kick-student.component';
import {MoveStudentComponent} from './dialogs/move-student/move-student.component';
import { UncancelClassComponent } from './dialogs/uncancel-class/uncancel-class.component';
import {TimetableModule} from '../timetable/timetable.module';
import { TimetableDialogComponent } from './dialogs/timetable-dialog/timetable-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HeaderModule,
    UiModule,
    FormsModule,
    TimetableModule,
    AssistantPanelRoutingModule
  ],
  entryComponents: [StudentFinderComponent, DivisionCreatorComponent, DeleteDivisionComponent,
    MassGroupEditComponent, ExportDivisionComponent, EditDivisionComponent, EditGroupComponent,
    DeleteGroupComponent, AddAnnouncementComponent, CancelClassComponent, AddActivityComponent,
    KickStudentComponent, MoveStudentComponent, TimetableDialogComponent],
  declarations: [AssistantPanelComponent, DepartmentsListComponent,
    DivisionsListComponent, GroupsListComponent, StudentsListComponent,
    PanelOptionsComponent, DepartmentOptionsComponent, DivisionOptionsComponent,
    GroupOptionsComponent, StudentOptionsComponent, StudentFinderComponent, DivisionCreatorComponent, DeleteDivisionComponent,
    MassGroupEditComponent, ExportDivisionComponent, EditDivisionComponent,
    EditGroupComponent, DeleteGroupComponent, AddAnnouncementComponent, CancelClassComponent,
    AddActivityComponent, KickStudentComponent, MoveStudentComponent, UncancelClassComponent, TimetableDialogComponent],

})
export class AssistantPanelModule {
}
