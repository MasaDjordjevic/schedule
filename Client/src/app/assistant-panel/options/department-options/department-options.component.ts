import {Component, OnInit} from '@angular/core';
import {Department} from '../../../models/Department';
import {Student} from '../../../models/Student';
import {StudentsService} from '../../services/students.service';
import {DepartmentsService} from '../../services/departments.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-department-options',
  templateUrl: './department-options.component.html',
  styleUrls: [ '../panel-options/panel-options.component.scss', './department-options.component.scss',]
})
export class DepartmentOptionsComponent implements OnInit {

  departmentId: number;
  department: Department;
  errorMessage: string;

  // Studenti koji se prikazuju klikom na "STUDENTI"
  students: Student[];

  // Brojevi indeksa selektiranih studenata iz this.students
  selectedStudents: any[] = [];

  constructor(private departmentService: DepartmentsService,
              private studentsService: StudentsService,
              private route: ActivatedRoute,) { }

  getDepartment(): void {
    if (!this.departmentId) {
      return;
    }
    this.departmentService.getDepartment(this.departmentId).then(
      department => this.department = department,
      error => this.errorMessage = <any>error
    );
  }

  getStudents(): void {
    if (!this.departmentId) {
      return;
    }
    this.studentsService.getStudentsOfDepartment(this.departmentId).then(
      students => this.students = students,
      error => this.errorMessage = <any>error
    );
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.departmentId = +params['departmentId'];
        this.getDepartment();
        this.getStudents();
      });
  }

}
