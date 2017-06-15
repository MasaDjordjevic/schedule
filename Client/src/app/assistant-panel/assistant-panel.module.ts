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
import {RomanNumeralsPipe} from './pipes/roman-numerals.pipe';
import {ThemeService} from './services/theme.service';
import { StudentFinderComponent } from './dialogs/student-finder/student-finder.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HeaderModule,
    UiModule,
    AssistantPanelRoutingModule
  ],
  entryComponents: [StudentFinderComponent],
  declarations: [AssistantPanelComponent, DepartmentsListComponent,
    DivisionsListComponent, GroupsListComponent, StudentsListComponent,
    PanelOptionsComponent, DepartmentOptionsComponent, DivisionOptionsComponent,
    GroupOptionsComponent, StudentOptionsComponent, RomanNumeralsPipe, StudentFinderComponent],
  providers: [DepartmentsService, DivisionsService, GroupsService, StudentsService, ThemeService]
})
export class AssistantPanelModule {
}
