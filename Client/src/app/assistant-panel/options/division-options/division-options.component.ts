import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DivisionsService} from '../../services/divisions.service';
import {ActivatedRoute, Params} from '@angular/router';
import {MdDialog} from '@angular/material';
import {DeleteDivisionComponent} from '../../dialogs/delete-division/delete-division.component';

@Component({
  selector: 'app-division-options',
  templateUrl: './division-options.component.html',
  styleUrls: ['../panel-options/panel-options.component.scss', './division-options.component.scss']
})
export class DivisionOptionsComponent implements OnInit {
  @Output() update: EventEmitter<any> = new EventEmitter<any>();

  divisionId: number;
  division: any;
  errorMessage: string;
  emptyGroup: any; // sluzi za dodavanje nove grupe preko edit-group komponente

  constructor(private divisionsService: DivisionsService,
              private route: ActivatedRoute,
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
        this.getDivision();
      });
  }


  openDeleteDivisionDialog() {
    this.dialog.open(DeleteDivisionComponent, {data: {division: this.division}});
  }

}
