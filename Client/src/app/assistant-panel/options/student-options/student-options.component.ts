import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {StudentsService} from '../../services/students.service';

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
              private studentsService: StudentsService) {
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

}
