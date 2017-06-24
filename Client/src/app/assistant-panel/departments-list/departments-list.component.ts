import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DepartmentsService} from '../services/departments.service';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit {
  @Input() primaryColor = 'MaterialBlue';

  private yearDepartments: any[];
  selectedDepartmentId: number = -1;
  private errorMessage: string;


  constructor(private departmentsService: DepartmentsService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.getDepartmentsByYear();
    this.route.params
      .subscribe((params: Params) => {
        this.selectedDepartmentId = +params['departmentId'];
      });

  }

  getDepartmentsByYear() {
    this.departmentsService.getDepartmentsByYear()
      .then(
        deps => this.yearDepartments = deps,
        error => this.errorMessage = <any>error);
  }

  onSelect(departmentId: number) {
    this.router.navigate(['/assistant', {departmentId: departmentId}]);
    console.log(departmentId);
  }

}
