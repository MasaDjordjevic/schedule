import {Component, Input, OnInit} from '@angular/core';
import {TypeDivisions} from '../../models/TypeDivisions';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DivisionsService} from '../services/divisions.service';

@Component({
  selector: 'app-divisions-list',
  templateUrl: './divisions-list.component.html',
  styleUrls: ['./divisions-list.component.scss']
})
export class DivisionsListComponent implements OnInit {

  @Input() primaryColor = 'MaterialBlue';
  @Input() secondaryColor = 'MaterialOrange';

  private typeDivisions: TypeDivisions[];
  private errorMessage: string;

  // ID trenutno selektirane raspodele (division) iz liste.
  private selectedDivisionId: number;
  private selectedDepartmentId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private divisionsService: DivisionsService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.selectedDepartmentId = +params['departmentId'];
        this.getDivisionsByType();
      });
  }

  onSelect(divisionId: number) {
    this.selectedDivisionId = divisionId;
    this.router.navigate(['/assistant', { departmentId: this.selectedDepartmentId, divisionId: divisionId}]);
  }


  getDivisionsByType() {
    if (!this.selectedDepartmentId) {
      return;
    }
    this.divisionsService.getDivisionsByType(this.selectedDepartmentId)
      .then(
        divs => this.typeDivisions = divs,
        error => this.errorMessage = <any>error);
  }

}
