import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
import {Mode} from '../../mode.enum';
import {TranslateService} from '@ngx-translate/core';
import {StudentsService} from '../../../shared/services/students.service';
import {AddTaskComponent} from '../add-task/add-task.component';
import {AddActivityComponent} from '../../../assistant-panel/dialogs/add-activity/add-activity.component';
import {GroupsService} from '../../../shared/services/groups.service';
import {CancelClassComponent} from '../../../assistant-panel/dialogs/cancel-class/cancel-class.component';
import {UncancelClassComponent} from '../../../assistant-panel/dialogs/uncancel-class/uncancel-class.component';
import {RefreshTimetableService} from '../../../shared/refresh-timetable.service';
import {BulletinBoardComponent} from '../bulletin-board/bulletin-board.component';

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
              public groupsService: GroupsService,
              public refreshTimetableService: RefreshTimetableService,
              public dialogRef: MdDialogRef<ClassDetailsComponent>,
              public dialog: MdDialog,
              public snackBar: MdSnackBar,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.class = data.class;
    this.mode = data.mode;
    console.log(this.class);
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
            this.refreshTimetableService.refresh();
            this.close();
            break;
          default:
            this.openSnackBar(this.translate.instant('error'));
            debugger;
            break;
        }
      });
  }

  openAddTaskDialog() {
    this.dialog.open(AddTaskComponent, {data: {groupId: this.class.classId}});
  }

  openAddAnnouncementDialog() {
    this.groupsService.getGroup(this.class.classId).then(
      group => {
        const dialogRef = this.dialog.open(AddActivityComponent, {data: {group: group}});
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'added') {
            this.refreshTimetableService.refresh();
            this.close();
          }
        });
      });
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }

  openCancelClassDialog() {
    this.groupsService.getGroup(this.class.classId).then(
      group => {
        const dialogRef = this.dialog.open(CancelClassComponent, {data: {group: group}});
        dialogRef.afterClosed().subscribe(result => {
          this.refreshTimetableService.refresh();
          this.close();
        });
      });
  }

  openUncancelClassDialog() {
    const dialogRef = this.dialog.open(UncancelClassComponent, {data: {groupId: this.class.classId}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'uncacelled') {
        this.refreshTimetableService.refresh();
        this.close();
      }
    });
  }

  openBulletinBoardComponent() {
    const dialogRef = this.dialog.open(BulletinBoardComponent, {data: {groupId: this.class.classId}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.refreshTimetableService.refresh();
        this.close();
      }
    });
  }
}
