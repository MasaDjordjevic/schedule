import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {Mode} from '../../mode.enum';
import {TranslateService} from '@ngx-translate/core';
import {StudentsService} from '../../../shared/services/students.service';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrls: ['./class-details.component.scss']
})
export class ClassDetailsComponent implements OnInit {

  class: any;
  mode: Mode;
  public _Mode = Mode;

  constructor(public studentsService: StudentsService,
              public dialogRef: MdDialogRef<ClassDetailsComponent>,
              public snackBar: MdSnackBar,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.class = data.class;
    this.mode = data.mode;
    console.log(this.mode);
  }

  ngOnInit() {
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public addToPersonal() {
    this.studentsService.unhideClass(this.class.classId)
      .then(
        response => {
          switch (response['status']) {
            case 'success':
              this.openSnackBar(this.translate.instant('class_added_to_personal_successful'));
              break;
            case 'error':
              switch (response['message']) {
                case 'class_already_in_personal':
                  this.openSnackBar(this.translate.instant('class_already_in_personal'));
                  break;
                default:
                  this.openSnackBar(this.translate.instant('error') + ' ' +
                  this.translate.instant('class_added_to_personal_unsuccessful'));
                  debugger;
                  break;
              }
              break;
            default:
              this.openSnackBar(this.translate.instant('error') + ' ' +
                this.translate.instant('class_added_to_personal_unsuccessful'));
              debugger;
              break;
          }
        }
      );
    // Ne treba da se zatvori.
  }

  // obrisi aktivnosti
  public deleteActivity() {
    this.studentsService.deleteActivity(this.class.activityId)
      .then(response => {
        switch (response['status']) {
          case 'uspelo':
            this.openSnackBar(this.translate.instant('successfully_deleted_activity'));
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('activity_not_deleted'));
            debugger;
            break;
        }
      });
  }

  // public deleteGlobalActivity() {
  //   this._activityScheduleService.deleteGlobalActivity(this.activityId)
  //     .then(status => console.log(status));
  // }

  // sakrij cas
  public hideClass() {
    this.studentsService.hideClass(this.class.classId)
      .then(response => {
        switch (response['status']) {
          case 'success':
            this.openSnackBar(this.translate.instant('class_hidden'));
            break;
          default:
            this.openSnackBar(this.translate.instant('error'));
            debugger;
            break;
        }
      });
  }

}
