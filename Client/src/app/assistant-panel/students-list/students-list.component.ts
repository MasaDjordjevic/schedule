import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {StudentsService} from '../services/students.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  @Input() primaryColor = 'MaterialBlue';
  @Input() secondaryColor = 'MaterialOrange';

  private students: any[];
  private errorMessage: string;

  // departmentId and divisionId are there for setting route parameters later
  private selectedDepartmentId: number;
  private selectedDivisionId: number;
  private selectedGroupId: number;
  private selectedStudentId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private studentService: StudentsService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.selectedDivisionId = +params['divisionId'];
        this.selectedDepartmentId = +params['departmentId'];
        this.selectedGroupId = +params['groupId'];
        const newStudentId = +params['studentId'];
        if (newStudentId !== this.selectedStudentId) {
          this.selectedStudentId = newStudentId;
          this.getStudents();
        }
      });
  }

  getStudents() {
    if (!this.selectedGroupId) {
      return;
    }
    this.studentService.getStudents(this.selectedGroupId)
      .then(
        studs => this.students = studs,
        error => this.errorMessage = <any>error);
  }

  onSelect(studentId: number) {
    this.selectedStudentId = studentId;
    this.router.navigate(['/assistant', {
      departmentId: this.selectedDepartmentId,
      divisionId: this.selectedDivisionId,
      groupId: this.selectedGroupId,
      studentId: this.selectedStudentId
    }]);
  }
}
