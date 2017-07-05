import {Component, OnInit} from '@angular/core';
import {TimetableType} from '../../shared/timetable-type.enum';
import {LoginService} from '../../login/login.service';

@Component({
  selector: 'app-student-panel',
  templateUrl: './student-panel.component.html',
  styleUrls: ['./student-panel.component.scss']
})
export class StudentPanelComponent implements OnInit {

  student: any;
  error: any;
  public _timetableType: TimetableType;
  public _TimetableType = TimetableType;

  public studentOfficialId: number;
  public studentId: number;
  public departmentId: number;

  clearAll() {
    this.studentOfficialId = this.studentId = this.departmentId = null;
  }

  public get timetableType() {
    return this._timetableType;
  }

  public set timetableType(ttt) {
    this._timetableType = ttt;
    this.clearAll();
    switch (ttt) {
      case TimetableType.Official:
        this.studentOfficialId = this.student.StudentId;
        break;
      case TimetableType.Personal:
        this.studentId = this.student.StudentId;
        break;
      case TimetableType.Global:
        this.departmentId = this.student.DepartmentId;
        break;
    }
  }

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.getStudent();
  }

  get leftOffset() {
    const ret =  this.timetableType * 100;
    return ret + 'px';
  }

  getStudent() {
    this.loginService.getUser()
      .then(
        student => this.student = student,
        error => this.error = error)
      .then(() => this.timetableType = TimetableType.Official)
      .then(() => console.log(this.student));
  }
}
