import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {StudentsService} from '../../../shared/services/students.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {ThemeService} from '../../../shared/theme.service';
import {TranslateService} from '@ngx-translate/core';
import {GroupsService} from '../../../shared/services/groups.service';
import {Student} from '../../../models/Student';

@Component({
  selector: 'app-move-student',
  templateUrl: './move-student.component.html',
  styleUrls: ['./move-student.component.scss']
})
export class MoveStudentComponent implements OnInit {

  groups: any[];
  groupId: number;
  divisionId: number;
  selectedGroupId: number;
  @Input() student: any;
  @HostBinding('class') themeClass = this.theme;
  errorMessage: string;

  constructor(public groupsService: GroupsService,
              public studentsService: StudentsService,
              public dialogRef: MdDialogRef<MoveStudentComponent>,
              public snackBar: MdSnackBar,
              private themeService: ThemeService,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.student = data.student;
    this.groupId = data.groupId;
    this.divisionId = data.divisionId;
    this.getGroupsOfDivision(this.divisionId);
    console.log(this.student);
  }

  ngOnInit() {
  }

  get theme() {
    return this.themeService.getTheme() + '-theme';
  }

  get accentClass() {
    return this.themeService.getTheme() + '-accent2';
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }


  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  get groupsWithoutCurrent() {
    return this.groups && this.groups.filter(e => e.GroupId !== this.groupId);
  }

  get groupName() {
    return this.groups
      && this.groups.filter(a => a.GroupId === this.groupId)[0]
      && this.groups.filter(a => a.GroupId === this.groupId)[0].Name;
  }

  getGroupsOfDivision(divisionId: number) {
    this.groupsService.getGroups(divisionId)
      .then(
        groups => this.groups = groups,
        error => this.errorMessage = <any>error);
  }

  save() {
    this.studentsService.moveToGroup(this.student.StudentId, this.selectedGroupId)
      .then(response => {
        switch (response['status']) {
          case 'success':
            this.openSnackBar(this.translate.instant('student_successfully_moved'));
            this.close('moved');
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('student_not_moved'));
            debugger;
            break;
        }
      });
  }
}
