import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit {
  @Input() primaryColor = 'MaterialBlue';
  @Input() secondaryColor = 'MaterialOrange';

  private yearDepartments: any[];
  selectedDepartmentId: number = -1;
  private errorMessage: string;

  // Nema @Input() jer se uvek prikazuju svi smerovi, ne zavisi ni od kakvog klika.
  @Output() selectDepartment: EventEmitter<any> = new EventEmitter();

  private _nestedListData = null;
  constructor() {
    this.yearDepartments = [
      {
        year: '1',
        departments: [{departmentId: 1, departmentName: 'racnarstvo'},
          {departmentId: 2, departmentName: 'energetika'} ,
          {departmentId: 3, departmentName: 'automatika'}]
      },
      {
        year: '2',
        departments: [{departmentId: 4, departmentName: 'racnarstvo'},
          {departmentId: 5, departmentName: 'energetika'} ,
          {departmentId: 6, departmentName: 'automatika'}]
      },
      {
        year: '3',
        departments: [{departmentId: 7, departmentName: 'racnarstvo'},
          {departmentId: 8, departmentName: 'energetika'}]
      },
    ];
  }

  ngOnInit() {
  }

  onSelect(departmentId: number) {
    this.selectedDepartmentId = departmentId;
    console.log(departmentId)
  }

}
