import {Component, Input, OnInit} from '@angular/core';
import {DepartmentsService} from '../../../shared/services/departments.service';
import {ClassroomsService} from '../../../shared/services/classrooms.service';
import {StudentsService} from '../../../shared/services/students.service';
import {LoginService} from '../../../login/login.service';

@Component({
  selector: 'app-panel-options',
  templateUrl: './panel-options.component.html',
  styleUrls: ['./panel-options.component.scss']
})
export class PanelOptionsComponent implements OnInit {

  _studentID: number;
  _groupID: number;
  _departmentId: number;
  _classroomId: number;
  _assistantId: number;

  mode = '';
  weeksFromNow: number;
  _selectedYear;

  private yearDepartments: any[];
  depsOfSelected: any[];
  classrooms: any[];
  students: any[];
  private errorMessage: string;


  constructor(private departmentsService: DepartmentsService,
              private classroomsService: ClassroomsService,
              private studentsService: StudentsService,
              private loginService: LoginService) { }


  getDepartmentName(depId: number) {
    return this.depsOfSelected.find(d => d.departmentId === depId).departmentName;
  }

  getClassroomNumber(id: number) {
    if (!this.classrooms || !id) {
      return '';
    }
    return this.classrooms.find(c => c.classroomId === id).number;
  }

  getStudentName(studentId: number) {
    const stud = this.students.find(s => s.StudentId === studentId);
    if (!stud) {
      return '';
    }
    return stud.UniMembers.Surname + ' ' + stud.UniMembers.Name + ' (' + stud.IndexNumber + ')';
  }

  get selectedYear() {
    return this._selectedYear;
  }

  set selectedYear(index: number) {
    this._selectedYear = index;
    this.depsOfSelected = this.yearDepartments[index].departments;
    this.departmentId = this.depsOfSelected[0].departmentId;
  }

  get studentId() {
    return this._studentID;
  }

  set studentId(s) {
    const depID = this._departmentId;
    this.clearAllIDs();
    this._departmentId = depID;
    this._studentID = s;
  }

  get groupId() {
    return this._groupID;
  }

  set groupId(g) {
    this.clearAllIDs();
    this._groupID = g;
  }

  get classroomId() {
    return this._classroomId;
  }

  set classroomId(c) {
    this.clearAllIDs();
    this._classroomId = c;
  }

  get departmentId() {
    return this._departmentId;
  }

  set departmentId(d) {
    this.clearAllIDs();
    this._departmentId = d;
    this.getStudentsOfDepartment();
  }


  get assistantId() {
    return this._assistantId;
  }

  @Input() set assistantId(a) {
    this.clearAllIDs();
    this._assistantId = a;
  }

  ngOnInit() {
    this.getClassrooms();
    this.getDepartmentsByYear();
  }

  clearAllIDs() {
    this._studentID = null;
    this._groupID = null;
    this._departmentId = null;
    this._classroomId = null;
    this._assistantId = null;
  }

  getClassrooms() {
    this.classroomsService.getClassrooms()
      .then(
        cls => this.classrooms = cls,
        error => this.errorMessage = <any>error);
  }

  getDepartmentsByYear() {
    this.departmentsService.getDepartmentsByYear()
      .then(
        deps => this.yearDepartments = deps,
        error => this.errorMessage = <any>error);
  }

  getStudentsOfDepartment() {
    this.studentsService.getStudentsOfDepartment(this._departmentId)
      .then(studs => this.students = studs,
        error => this.errorMessage = error);
  }

}
