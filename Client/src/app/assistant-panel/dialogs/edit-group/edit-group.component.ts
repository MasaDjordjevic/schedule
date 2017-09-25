import {Component, HostBinding, OnInit} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import {StudentsService} from '../../../shared/services/students.service';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../../shared/theme.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {Inject} from '@angular/core';
import {AssistantsService} from '../../../shared/services/assistants.service';
import {ClassroomsService} from '../../../shared/services/classrooms.service';
import {GroupsService} from '../../../shared/services/groups.service';


@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  group: any;
  editedGroup: any = {};

  private classrooms;
  private assistants;
  students;
  private errorMessage;

  query = '';

  private daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  @HostBinding('class') themeClass = this.theme;

  constructor(private classroomsService: ClassroomsService,
              private assistantsService: AssistantsService,
              private studentsService: StudentsService,
              private groupsService: GroupsService,
              private translate: TranslateService,
              private themeService: ThemeService,
              public snackBar: MdSnackBar,
              public dialogRef: MdDialogRef<EditGroupComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.group = data.group;
    console.log(this.group);
    this.cloneToEdit(this.group);
    this.afterGroupInit();
  }

  ngOnInit() {
  }

  get theme() {
    return this.themeService.getTheme() + '-theme';
  }

  private cloneToEdit(group) {
    this.editedGroup.name = group.Name;
    this.editedGroup.classroomId = group.ClassroomId;
    this.editedGroup.assistantId = group.assistant && group.Assistant.UniMemberId;
    this.editedGroup.dateTimeStart = group.TimeSpan && group.TimeSpan.StartDate;
    this.editedGroup.dateTimeEnd = group.TimeSpan && group.TimeSpan.EndDate;
    this.editedGroup.period = group.TimeSpan && group.TimeSpan.period;

    if (group.TimeSpan != null) {
      this.editedGroup.dayOfWeek = moment(group.TimeSpan.StartDate).clone().day();
      this.editedGroup.timeStart = moment(group.TimeSpan.StartDate).clone().format('HH:mm');
      this.editedGroup.timeEnd = moment(group.TimeSpan.EndDate).clone().format('HH:mm');
    }
  }

  afterGroupInit() {
    this.getAllStudents();
    this.getClassrooms();
    if (this.group.GroupId) {
      this.getAssistants();
    }
  }

  getAssistants() {
    this.assistantsService.getAssistantsByGroupID(this.group.GroupId).then(
      asst => this.assistants = asst,
      error => this.errorMessage = error
    );
  }

  getAllAssistants() {
    this.assistantsService.getAssistants().then(
      asst => this.concatAssistants(asst),
      error => this.errorMessage = error
    );
  }

  concatAssistants(asst) {
    this.assistants = this.assistants ? this.assistants.concat(asst) : asst;

    // brisanje duplikata
    this.assistants = this.uniq_fast(this.assistants);
  }

  getClassrooms() {
    this.classroomsService.getClassrooms()
      .then(
        cls => this.classrooms = cls,
        error => this.errorMessage = <any>error);
  }

  getAllStudents() {
    this.studentsService.getStudentsOfDepartment(this.group.Division.DepartmentId)
      .then(
        students => this.students = students,
        error => this.errorMessage = <any>error);
  }

  getClassroomNumber(id: number) {
    if (!this.classrooms || !id) {
      return '';
    }
    return this.classrooms.find(c => c.classroomId === id).number;
  }

  getAssistantName(id: number) {
    if (!this.editedGroup.assistantId) {
      return '';
    }
    const asst = this.assistants.find(a => a.uniMemberId === id);
    return asst.name + ' ' + asst.surname;
  }

  getDayOfWeek(day: number) {
    if (!day) {
      return '';
    }
    if (day === 0) {
      day = 6;
    } else {
      day--;
    }
    return this.daysOfWeek[day];
  }

  getPeriod(period: number) {
    switch (period) {
      case 1:
        return this.translate.instant('every_week');
      case 2:
        return this.translate.instant('every_second_week');
      case 4:
        return this.translate.instant('every_fourth_week');
      case 0:
        return this.translate.instant('just_once');
      default:
        return '';
    }
  }

  uniq_fast(a) {
    const seen = {};
    const out = [];
    const len = a.length;
    let j = 0;
    for (let i = 0; i < len; i++) {
      const item = a[i];
      if (seen[item.UniMemberId] !== 1) {
        seen[item.UniMemberId] = 1;
        out[j++] = item;
      }
    }
    return out;
  }


  selectionChanged(param) {
    this.editedGroup.GroupsStudents = _.xor([param], this.editedGroup.GroupsStudents);
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {duration: 2000});
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }

  save() {
    const pom: Array<number> = (this.editedGroup.GroupsStudents && this.editedGroup.GroupsStudents.length > 0) ?
      this.editedGroup.GroupsStudents.map(i => i.StudentId) : [];
    let timespan: any = {};

    // ako nista nije odabrano
    if (!this.editedGroup.period) {
      timespan = null;
    } else {
      timespan.startDate = new Date(this.editedGroup.dateTimeStart);
      timespan.endDate = new Date(this.editedGroup.dateTimeEnd);
      timespan.period = +this.editedGroup.period;
      timespan.dayOfWeek = this.editedGroup.dayOfWeek;
      timespan.timeStart = this.editedGroup.timeStart;
      timespan.timeEnd = this.editedGroup.timeEnd;
    }

    this.groupsService.updateGroup(
      this.group.GroupId, this.group.Division.DivisionId, this.editedGroup.assistantId,
      this.editedGroup.name, this.editedGroup.classroomId, timespan, pom
    )
      .then(response => {
        switch (response.status) {
          case 'success':
            this.openSnackBar(this.translate.instant('successfully_edited_group__1') +
              ' ' + this.editedGroup.name + ' ' + this.translate.instant('successfully_edited_group__2'));
            this.close('updated');
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('group_not_edited'));
            debugger;
            break;
        }
      });
  }
}
