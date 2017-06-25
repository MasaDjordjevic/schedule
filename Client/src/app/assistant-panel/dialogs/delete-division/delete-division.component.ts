import {Component, Inject, Input, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {DivisionsService} from '../../services/divisions.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-delete-division',
  templateUrl: './delete-division.component.html',
  styleUrls: ['./delete-division.component.scss']
})
export class DeleteDivisionComponent implements OnInit {
  @Input() division: any;

  constructor(public dialogRef: MdDialogRef<DeleteDivisionComponent>,
              public snackBar: MdSnackBar,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any,
              private dvisionsService: DivisionsService) {
    this.division = data.division;
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }


  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  removeDivision() {
    this.dvisionsService.deleteDivision(this.division.DivisionId)
      .then(response => {
        switch (response.status) {
          case 'success':
            this.openSnackBar(
              this.translate.instant('successfully_deleted_division__1') + this.division.Name +
              this.translate.instant('successfully_deleted_division__2'));
              this.close('deleted');
            console.log('uspelo');
            break;
          default:
            this.openSnackBar(
              this.translate.instant('division_not_deleted__1') + this.division.Name +
              this.translate.instant('division_not_deleted__2'));
            debugger;
            this.close();
            break;
        }
      });
  }

  ngOnInit() {
  }

}
