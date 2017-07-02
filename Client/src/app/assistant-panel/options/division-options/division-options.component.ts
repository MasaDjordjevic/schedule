import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DivisionsService} from '../../services/divisions.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MdDialog, MdSnackBar} from '@angular/material';
import {DeleteDivisionComponent} from '../../dialogs/delete-division/delete-division.component';
import {MassGroupEditComponent} from '../../dialogs/mass-group-edit/mass-group-edit.component';
import {ExportDivisionComponent} from '../../dialogs/export-division/export-division.component';
import {TranslateService} from '@ngx-translate/core';
import {EditDivisionComponent} from '../../dialogs/edit-division/edit-division.component';
import {EditGroupComponent} from '../../dialogs/edit-group/edit-group.component';

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
              private translate: TranslateService,
              public snackBar: MdSnackBar,
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

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {duration: 2000});
  }

  copyDivision() {
    this.divisionsService.copyDivision(this.divisionId)
      .then(response => {
        switch (response.status) {
          case 'success':
            this.openSnackBar(this.translate.instant('successfully_copied_division__1') +
              ' ' + this.division.Name + ' ' + this.translate.instant('successfully_copied_division__2'));
            // refresh
            this.router.navigate(['/assistant', {departmentId: this.departmentId}]);
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' '
              + this.translate.instant('division_not_copied'));
            debugger;
            break;
        }
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
      this.router.navigate(['/assistant', {
        departmentId: this.departmentId,
        divisionId: this.divisionId,
        refresh: this.refreshNumber++
      }]);
    });
  }

  openExportDivisionDialog() {
    this.dialog.open(ExportDivisionComponent, {data: {division: this.division}});
  }

  openEditDivisionDialog() {
    const dialogRef = this.dialog.open(EditDivisionComponent, {data: {division: this.division}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'edited') {
        this.router.navigate(['/assistant', {departmentId: this.departmentId}]);
      }
    });
  }

  openNewGroupDialog() {
    const dialogRef = this.dialog.open(EditGroupComponent, {
      data: {
        group: {Name: '', ClassroomId: null, GroupsStudents: [], Division: this.division}
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.router.navigate(['/assistant', {
          departmentId: this.departmentId,
          divisionId: this.divisionId,
          refresh: this.refreshNumber++
        }]);
      }
    });
  }

}
