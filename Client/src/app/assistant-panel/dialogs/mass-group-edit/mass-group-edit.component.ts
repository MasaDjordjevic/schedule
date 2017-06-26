import {Component, Inject, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {ClassroomsService} from '../../../test/classrooms/classrooms.service';
import {GroupsService} from '../../services/groups.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-mass-group-edit',
  templateUrl: './mass-group-edit.component.html',
  styleUrls: ['./mass-group-edit.component.scss']
})
export class MassGroupEditComponent implements OnInit {

  private _division: any;
  private classrooms: any;
  private errorMessage: string;

  private editedDivision = [];
  private daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  public get division() {
    return this._division;
  }

  @Input()
  public set division(d) {
    this._division = d;
    this.editedDivision = [];
    for (let i = 0; i < this.division.Groups.length; i++) {
      // vrlo je bitno da idu istim redom zbog čuvanja kasnije
      if (this.division.Groups[i].timeSpan) {
        this.editedDivision.push({
          groupId: this.division.Groups[i].groupID,
          classroomId: this.division.Groups[i].classroomID,
          period: this.division.Groups[i].timeSpan.period,
          dayOfWeek: moment(this.division.Groups[i].timeSpan.startDate).clone().day(), // 0 nedelja, 1 ponedeljak, ... 6 subota
          timeStart: this.division.Groups[i].timeSpan.period === 0 ? null :
            moment(this.division.Groups[i].timeSpan.startDate).clone().format('HH:mm'),
          timeEnd: this.division.Groups[i].timeSpan.period === 0 ? null :
            moment(this.division.Groups[i].timeSpan.endDate).clone().format('HH:mm'),
          dateTimeStart: this.division.Groups[i].timeSpan.period !== 0 ? null :
            moment(this.division.Groups[i].timeSpan.startDate).clone().format('YYYY-MM-DD HH:mm'),
          dateTimeEnd: this.division.Groups[i].timeSpan.period !== 0 ? null :
            moment(this.division.Groups[i].timeSpan.endDate).clone().format('YYYY-MM-DD HH:mm'),
        });
      } else {
        this.editedDivision.push({
          groupId: this.division.Groups[i].groupID,
          classroomId: this.division.Groups[i].classroomID,
          period: null,
          dayOfWeek: null,
          timeStart: null,
          timeEnd: null,
          dateTimeStart: null,
          dateTimeEnd: null,
        });
      }
    }
  };

  constructor(public dialogRef: MdDialogRef<MassGroupEditComponent>,
              public snackBar: MdSnackBar,
              private translate: TranslateService,
              private classroomsService: ClassroomsService,
              private groupsService: GroupsService,
              @Inject(MD_DIALOG_DATA) public data: any, ) {
    this.getClassrooms();
    this.division = data.division;
    console.log(this.division);
  }

  getClassrooms() {
    this.classroomsService.getClassrooms()
      .then(
        cls => this.classrooms = cls,
        error => this.errorMessage = <any>error);
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }



  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public save() {
    const sendData = [];
    for (let i = 0; i < this.editedDivision.length; i++) {
      // pripremanje parametara za slanje
      const sendObj: any = {
        groupId: this.editedDivision[i].groupId,
        classroomId: this.editedDivision[i].classroomId,
        timespan: null
      };
      // ostace null ukoliko nista nije izabrano
      if (this.editedDivision[i].period) {
        sendObj.timespan = {
          startDate: new Date(this.editedDivision[i].dateTimeStart),
          endDate: new Date(this.editedDivision[i].dateTimeEnd),
          period: +this.editedDivision[i].period,
          dayOfWeek: this.editedDivision[i].dayOfWeek,
          timeStart: this.editedDivision[i].timeStart,
          timeEnd: this.editedDivision[i].timeEnd
        };
      }
      sendData.push(sendObj);
    }


    this.groupsService.massGroupEdit(sendData)
      .then(response => {
        switch (response.status) {
          case 'uspelo':
            this.openSnackBar(this.translate.instant('successfully_edited_groups_from_division__1')
              + ' ' + this.division.name + ' ' +
              this.translate.instant('successfully_edited_groups_from_division__1'));
            break;
          default:
            this.openSnackBar(this.translate.instant('error')
              + ' ' + this.translate.instant('mass_edit_unsuccessful'));
            debugger;
            break;
        }
      });
  }

  ngOnInit() {
  }

}
