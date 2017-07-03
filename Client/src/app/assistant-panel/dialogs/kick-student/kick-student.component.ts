import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {StudentsService} from '../../services/students.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {ThemeService} from '../../../shared/theme.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-kick-student',
  templateUrl: './kick-student.component.html',
  styleUrls: ['./kick-student.component.scss']
})
export class KickStudentComponent implements OnInit {
  @Input() student: any;
  @HostBinding('class') themeClass = this.theme;

  groupId: number;

  constructor(public studentsService: StudentsService,
              public dialogRef: MdDialogRef<KickStudentComponent>,
              public snackBar: MdSnackBar,
              private themeService: ThemeService,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.student = data.student;
    this.groupId = data.groupId;
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

  kickStudnet() {
    this.studentsService.removeFromGroup(this.student.StudentId, this.groupId)
      .then(response => {
        switch (response['status']) {
          case 'success':
            this.openSnackBar(this.translate.instant('student_kick_successful'));
            this.close('kicked');
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('student_kick_unsuccessful'));
            debugger;
            break;
        }
      });
  }
}
