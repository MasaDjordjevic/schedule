import {Component, Inject, Input, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {DivisionsService} from '../../services/divisions.service';

@Component({
  selector: 'app-delete-division',
  templateUrl: './delete-division.component.html',
  styleUrls: ['./delete-division.component.scss']
})
export class DeleteDivisionComponent implements OnInit {
  @Input() division: any;

  constructor(public dialogRef: MdDialogRef<DeleteDivisionComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private dvisionsService: DivisionsService) {
    this.division = data.division;
  }

  close() {
    this.dialogRef.close();
  }

  removeDivision() {
    this.dvisionsService.deleteDivision(this.division.DivisionId)
      .then(response => {
        switch (response.status) {
          case 'success':
            console.log('uspelo');
            break;
          default:

            debugger;
            break;
        }
      });
  }

  ngOnInit() {
  }

}
