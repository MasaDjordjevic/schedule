import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {CoursesService} from '../../services/courses.service';
import {DivisionsService} from '../../services/divisions.service';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../services/theme.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import * as moment from 'moment';
import {DivisionType} from '../../../models/DivisionType';
import {Course} from '../../../models/Course';
import {StudentsService} from '../../services/students.service';

@Component({
  selector: 'app-edit-division',
  templateUrl: './edit-division.component.html',
  styleUrls: ['./edit-division.component.scss']
})
export class EditDivisionComponent implements OnInit {

  courses: any[];
  divisionTypes: DivisionType;
  studentsOfCourse: any[];
  division: any;
  private editedDivision: any = {};
  errorMessage: string;

  @HostBinding('class') themeClass = this.theme;

  constructor(private coursesService: CoursesService,
              private divisionsService: DivisionsService,
              private studentsService: StudentsService,
              private translate: TranslateService,
              private themeService: ThemeService,
              public snackBar: MdSnackBar,
              public dialogRef: MdDialogRef<EditDivisionComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.division = data.division;
    this.cloneToEdit(this.division);
    this.getCoursesOfDepartment();
    this.getStudents();
    this.getAllDivisionTypes();
    console.log(this.division);
  }

  ngOnInit() {
  }

  get theme() {
    return this.themeService.getTheme() + '-theme';
  }

  private cloneToEdit(division) {
    this.editedDivision.name = division.Name;
    this.editedDivision.beginning = moment(division.Beginning).format('YYYY-MM-DD');
    this.editedDivision.ending = moment(division.Ending).format('YYYY-MM-DD');
    this.editedDivision.divisionTypeId = division.DivisionTypeId;
    this.editedDivision.courseId = division.CourseId;
  }

  private reset = () => this.cloneToEdit(this.division);


  getCoursesOfDepartment() {
    this.coursesService.getCoursesOfDepartment(this.division.DepartmentId)
      .then(
        crs => this.courses = crs,
        error => this.errorMessage = <any>error);
  }

  // Iz look-up tabele
  public getAllDivisionTypes() {
    this.divisionsService.getAllDivisionTypes()
      .then(type => this.divisionTypes = type,
        error => this.errorMessage = <any>error);
  }

  getStudents() {
    if (this.division.CourseId == null) {
      return;
    }

    this.studentsService.getStudentsOfCourse(this.division.CourseId)
      .then(
        studs => this.studentsOfCourse = studs,
        error => this.errorMessage = error);
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }

  update() {
    const sendId = this.division.divisionId;
    const sendName = this.editedDivision.name;
    const sendBeginning = this.editedDivision.beginning;
    const sendEnding = this.editedDivision.ending;
    const sendDivisionTypeID = this.editedDivision.divisionTypeId;
    const sendCourseID = this.editedDivision.courseId;

    console.log(sendId, sendName, sendBeginning, sendEnding, sendDivisionTypeID, sendCourseID);
    /*debugger;*/

    this.divisionsService.updateDivision(
      sendId, sendName, sendBeginning, sendEnding, sendDivisionTypeID, sendCourseID)
      .then(response => {
        switch (response.status) {
          case 'success':
            this.snackBar.open(this.translate.instant('successfully_edited_division__1') +
              ' ' + sendName + ' ' + this.translate.instant('successfully_edited_division__2'));
            this.close('edited');
            break;
          default:
            this.snackBar.open(this.translate.instant('error') + ' ' + this.translate.instant('group_not_edited'));
            debugger;
            this.close();
            break;
        }
      });

  }

}
