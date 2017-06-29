import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DivisionsService} from '../../services/divisions.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MdDialog} from '@angular/material';
import {DeleteDivisionComponent} from '../../dialogs/delete-division/delete-division.component';
import {MassGroupEditComponent} from '../../dialogs/mass-group-edit/mass-group-edit.component';

@Component({
  selector: 'app-division-options',
  templateUrl: './division-options.component.html',
  styleUrls: ['../panel-options/panel-options.component.scss', './division-options.component.scss']
})
export class DivisionOptionsComponent implements OnInit {
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  departmentId: number; // for refreshing
  divisionId: number;
  division: any;
  errorMessage: string;
  emptyGroup: any; // sluzi za dodavanje nove grupe preko edit-group komponente

  private refreshNumber = 0;

  constructor(private divisionsService: DivisionsService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MdDialog) { }

  getDivision(): void {
    if (!this.divisionId) {
      return;
    }
    this.divisionsService.getDivision(this.divisionId).then(
      division => this.setDivision(division),
      error => this.errorMessage = <any>error
    );
  }

  setDivision(div) {
    this.division = div;
    this.emptyGroup = {name: '', classroomID: null, GroupsStudents: [], division: this.division};
  }

  public totalNumberOfStudents() {
    let sum = 0;
    for (let i = 0; i < this.division.Groups.length; i++) {
      sum += this.division.Groups[i].GroupsStudents.length;
    }
    return sum;
  }


  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.divisionId = +params['divisionId'];
        this.departmentId = +params['departmentId'];
        this.getDivision();
      });
  }


  openDeleteDivisionDialog() {
    const dialogRef = this.dialog.open(DeleteDivisionComponent, {data: {division: this.division}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.router.navigate(['/assistant', {departmentId: this.departmentId}]);
      }
    });
  }

  openGroupsDialog() {
    const dialogRef = this.dialog.open(MassGroupEditComponent, {data: {division: this.division}});
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/assistant', {departmentId: this.departmentId, divisionId: this.divisionId, refresh: this.refreshNumber++}]);
    });
  }


}
