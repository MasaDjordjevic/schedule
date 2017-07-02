import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {StudentsService} from '../../services/students.service';
import {ThemeService} from '../../services/theme.service';
import {TranslateService} from '@ngx-translate/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import {KickStudentComponent} from '../../dialogs/kick-student/kick-student.component';

@Component({
  selector: 'app-student-options',
  templateUrl: './student-options.component.html',
  styleUrls: ['../panel-options/panel-options.component.scss', './student-options.component.scss']
})
export class StudentOptionsComponent implements OnInit {
  selectedDepartmentId: number;
  selectedDivisionId: number;
  selectedGroupId: number;

  studentId: number;
  student: any;
  errorMessage: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              public snackBar: MdSnackBar,
              public dialog: MdDialog,
              private studentsService: StudentsService,
              private themeService: ThemeService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.selectedDepartmentId = +params['departmentId'];
        this.selectedDivisionId = +params['divisionId'];
        this.selectedGroupId = +params['groupId'];
        this.studentId = +params['studentId'];
        this.getStudent();
      });
  }

  getStudent(): void {
    if (!this.studentId) {
      return;
    }
    this.studentsService.getStudent(this.studentId).then(
      student => this.student = student,
      error => this.errorMessage = <any>error
    );
  }

  get themeClass() {
    return this.themeService.getTheme() + '-accent2';
  }

  openKickStudentDialog() {
    const dialogRef = this.dialog.open(KickStudentComponent, {data: {student: this.student, groupId: this.selectedGroupId}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'kicked') {
        this.router.navigate(['/assistant', {
          departmentId: this.selectedDepartmentId,
          divisionId: this.selectedDivisionId,
          groupId: this.selectedGroupId
        }]);
      }
    });
  }
}
