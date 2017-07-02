import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {StudentsService} from '../../services/students.service';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../services/theme.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {Inject} from '@angular/core';
import {AssistantsService} from '../../services/assistants.service';
import {ClassroomsService} from '../../services/classrooms.service';

@Component({
  selector: 'app-edit-grouproup',
  templateUrl: './edit-grouproup.component.html',
  styleUrls: ['./edit-grouproup.component.scss']
})
export class EditGroupComponent implements OnInit {

  group: any;
  editedGroup: any;

  private classrooms;
  private assistants;
  private errorMessage;

  otherStudents;
  chosenStudents;

  constructor(private classroomsService: ClassroomsService,
              private assistantsService: AssistantsService,
              private studentsService: StudentsService,
              private translate: TranslateService,
              private themeService: ThemeService,
              public snackBar: MdSnackBar,
              public dialogRef: MdDialogRef<EditGroupComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) { }

  ngOnInit() {
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

    const ret = [];
    for (let i = 0; i < this.group.GroupsStudents.length; i++) {
      ret.push(this.group.GroupsStudents[i].student);
    }
    this.chosenStudents = ret;

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
        otherStudents => this.otherStudents = otherStudents,
        error => this.errorMessage = <any>error);
  }


  uniq_fast(a) {
    const seen = {};
    const out = [];
    const len = a.length;
    let j = 0;
    for (let i = 0; i < len; i++) {
      const item = a[i];
      if (seen[item.uniMemberID] !== 1) {
        seen[item.uniMemberID] = 1;
        out[j++] = item;
      }
    }
    return out;
  }

  // prihvata niz studentID
  moveToOthers(arr) {
    if (!arr) {
      return;
    } // ako nista nije selektirano
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < this.chosenStudents.length; j++) {
        if (this.chosenStudents[j].StudentId === arr[i]) {
          this.chosenStudents.splice(j--, 1);
        }
      }
    }
  }

  // prihvata niz studentID
  moveToChosen(arr) {
    if (!arr) {
      return;
    } // ako nista nije selektirano
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < this.otherStudents.length; j++) {
        if (this.otherStudents[j].StudentId === arr[i]) {
          this.chosenStudents.push(this.otherStudents[j]);
        }
      }
    }
  }
}
