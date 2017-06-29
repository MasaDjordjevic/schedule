import {Component, Inject, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {ClassroomsService} from '../../../test/classrooms/classrooms.service';
import {GroupsService} from '../../services/groups.service';
import {TranslateService} from '@ngx-translate/core';
import {startWith} from 'rxjs/operator/startWith';
import {ThemeService} from '../../services/theme.service';

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
  private daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  public get division() {
    return this._division;
  }

  @Input()
  public set division(d) {
    this._division = d;
    this.editedDivision = [];
    console.log(this.division.Groups);
    for (let i = 0; i < this.division.Groups.length; i++) {
      // vrlo je bitno da idu istim redom zbog čuvanja kasnije
      if (this.division.Groups[i].TimeSpan) {
        this.editedDivision.push({
          groupId: this.division.Groups[i].GroupId,
          classroomId: this.division.Groups[i].ClassroomId,
          period: this.division.Groups[i].TimeSpan.Period,
          dayOfWeek: moment(this.division.Groups[i].TimeSpan.StartDate).clone().day(), // 0 nedelja, 1 ponedeljak, ... 6 subota
          timeStart: this.division.Groups[i].TimeSpan.Period === 0 ? null :
            moment(this.division.Groups[i].TimeSpan.StartDate).clone().format('HH:mm'),
          timeEnd: this.division.Groups[i].TimeSpan.Period === 0 ? null :
            moment(this.division.Groups[i].TimeSpan.EndDate).clone().format('HH:mm'),
          dateTimeStart: this.division.Groups[i].TimeSpan.Period !== 0 ? null :
            moment(this.division.Groups[i].TimeSpan.StartDate).clone().format('YYYY-MM-DD HH:mm'),
          dateTimeEnd: this.division.Groups[i].TimeSpan.Period !== 0 ? null :
            moment(this.division.Groups[i].TimeSpan.EndDate).clone().format('YYYY-MM-DD HH:mm'),
        });
      } else {
        this.editedDivision.push({
          groupId: this.division.Groups[i].GroupId,
          classroomId: this.division.Groups[i].ClassroomId,
          Period: null,
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
              private themeService: ThemeService,
              private classroomsService: ClassroomsService,
              private groupsService: GroupsService,
              @Inject(MD_DIALOG_DATA) public data: any,) {
    this.getClassrooms();
    this.division = data.division;
    console.log(this.division);
  }

  get theme() {
    return this.themeService.getTheme() + '-theme';
  }

  getClassrooms() {
    this.classroomsService.getClassrooms()
      .then(
        cls => this.classrooms = cls,
        error => this.errorMessage = <any>error);
  }

  getClassroomNumber(id: number) {
    if (!this.classrooms) {
      return '';
    }
    return this.classrooms.find(c => c.classroomId === id).number;
  }

  getDayOfWeek(day: number) {
    if (day === 0) {
      day = 6;
    } else {
      day--;
    }
    return this.daysOfWeek[day];
  }

  getPeriod(period: number) {
    switch (period) {
      case 1:
        return this.translate.instant('every_week');
      case 2:
        return this.translate.instant('every_second_week');
      case 4:
        return this.translate.instant('every_fourth_week');
      case 0:
        return this.translate.instant('just_once');
      default:
        return '';
    }
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
          StartDate: new Date(this.editedDivision[i].dateTimeStart),
          EndDate: new Date(this.editedDivision[i].dateTimeEnd),
          Period: +this.editedDivision[i].period,
          DayOfWeek: this.editedDivision[i].dayOfWeek,
          TimeStart: this.editedDivision[i].timeStart,
          TimeEnd: this.editedDivision[i].timeEnd
        };
      }
      sendData.push(sendObj);
    }


    this.groupsService.massGroupEdit(sendData)
      .then(response => {
        switch (response.status) {
          case 'uspelo':
            this.openSnackBar(this.translate.instant('successfully_edited_groups_from_division__1')
              + ' ' + this.division.Name + ' ' +
              this.translate.instant('successfully_edited_groups_from_division__2'));
            this.close();
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
