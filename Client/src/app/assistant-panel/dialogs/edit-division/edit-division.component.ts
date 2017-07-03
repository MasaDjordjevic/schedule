import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {CoursesService} from '../../services/courses.service';
import {DivisionsService} from '../../services/divisions.service';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../../shared/theme.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import * as moment from 'moment';
import {StudentsService} from '../../services/students.service';

@Component({
  selector: 'app-edit-division',
  templateUrl: './edit-division.component.html',
  styleUrls: ['./edit-division.component.scss']
})
export class EditDivisionComponent implements OnInit {

  courses: any[];
  divisionTypes: any[];
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
      .then(
        type => this.divisionTypes = type,
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

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


  getCourseName(courseId: number) {
    return this.courses && this.courses.find(c => c.CourseId === courseId).Name;
  }

  getDivisionTypeName(divisionTypeId: number) {
    return this.divisionTypes && this.divisionTypes.find(d => d.divisionTypeId === divisionTypeId).type;
  }

  update() {
    const sendId = this.division.DivisionId;
    const sendName = this.editedDivision.name;
    const sendBeginning = this.editedDivision.beginning;
    const sendEnding = this.editedDivision.ending;
    const sendDivisionTypeId = this.editedDivision.divisionTypeId;
    const sendCourseId = this.editedDivision.courseId;


    console.log(sendId, sendName, sendBeginning, sendEnding, sendDivisionTypeId, sendCourseId);

    this.divisionsService.updateDivision(
      sendId, sendName, sendBeginning, sendEnding, sendDivisionTypeId, sendCourseId)
      .then(response => {
        switch (response.status) {
          case 'success':
            this.openSnackBar(this.translate.instant('successfully_edited_division__1') +
              ' ' + sendName + ' ' + this.translate.instant('successfully_edited_division__2'));
            this.close('edited');
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' + this.translate.instant('group_not_edited'));
            debugger;
            this.close();
            break;
        }
      });

  }

}
