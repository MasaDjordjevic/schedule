import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {GroupsService} from '../../../shared/services/groups.service';

@Component({
  selector: 'app-uncancel-class',
  templateUrl: './uncancel-class.component.html',
  styleUrls: ['./uncancel-class.component.scss']
})
export class UncancelClassComponent implements OnInit {

  groupId: any;
  private dateChoices: any[];
  private errorMessage;
  private selectedDate: number;


  constructor(private groupsService: GroupsService,
              public dialogRef: MdDialogRef<UncancelClassComponent>,
              public snackBar: MdSnackBar,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.groupId = data.groupId;
  }

  ngOnInit() {
  }

  getCanceledTimes() {
    this.groupsService.getCanceledTimes(this.groupId)
      .then(
        dateChoices => this.dateChoices = dateChoices,
        error => this.errorMessage = error)
      .then(
        () => this.selectedDate = this.dateChoices && this.dateChoices[0]
      );
  }

  uncancelClass() {
    debugger;
    this.groupsService.unCancelClass(this.selectedDate)
      .then(response => console.log(response));
  }
}
