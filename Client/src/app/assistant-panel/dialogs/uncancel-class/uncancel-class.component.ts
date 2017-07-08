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
  times: any[];
  errorMessage;
  selectedActivity: number;


  constructor(private groupsService: GroupsService,
              public dialogRef: MdDialogRef<UncancelClassComponent>,
              public snackBar: MdSnackBar,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.groupId = data.groupId;
    this.getCanceledTimes();
  }

  ngOnInit() {
  }

  getSelectedDate(activityId: number) {
    if (!activityId) {
      return '';
    }
    return this.times.find(a => a.activityId === activityId).time;
  }

  getCanceledTimes() {
    this.groupsService.getCanceledTimes(this.groupId)
      .then(
        times => this.times = times,
        error => this.errorMessage = error)
      .then(() => console.log(this.times))
      .then(
        () => this.selectedActivity = this.times && this.times[0].activityId
      );
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }


  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  uncancelClass() {
    this.groupsService.unCancelClass(this.selectedActivity)
      .then(response => {
        switch (response['status']) {
          case 'success':
            this.openSnackBar(this.translate.instant('class_successfully_uncanceled'));
            this.close();
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('class_not_uncanceled'));
            debugger;
            break;
        }
      });
  }
}
