import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {GroupsService} from '../../services/groups.service';
import {ClassroomsService} from '../../services/classrooms.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {ThemeService} from '../../../shared/theme.service';
import {TranslateService} from '@ngx-translate/core';
import {TimeSpan} from '../../../models/TimeSpan';
import * as moment from 'moment';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent implements OnInit {

  @Input() group: any;
  @HostBinding('class') themeClass = this.theme;

  private classrooms;
  private errorMessage;
  dateChoices: string[];


  announcement: { title: string, content: string, startDate: any, endDate: any }
    = <any>{};

  constructor(public groupsService: GroupsService,
              public classroomsService: ClassroomsService,
              public dialogRef: MdDialogRef<AddActivityComponent>,
              public snackBar: MdSnackBar,
              private themeService: ThemeService,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.group = data.group;
    if (this.group.TimeSpan) {
      this.listDateChoices(this.group.TimeSpan, this.group.TimeSpan.Period);
    }
    this.resetAnnouncement();
    console.log(this.group);
  }

  ngOnInit() {
  }

  get theme() {
    return this.themeService.getTheme() + '-theme';
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }


  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  resetAnnouncement() {
    this.announcement = {
      content: '',
      title: '',
      startDate: null,
      endDate: null
    };
  }

  getClassrooms() {
    this.classroomsService.getClassrooms()
      .then(
        cls => this.classrooms = cls,
        error => this.errorMessage = <any>error);
  }

  public listDateChoices(date, period) {

    const ret: string[] = [];
    if (period === 0) {
      // cas se samo jednom odrzava, ponudi mu samo taj jedan izbor
      ret.push(moment(date).format('YYYY-MM-DD'));
    } else {
      // cas se odrzava periodicno, ponudi mu 4 sledece instance casa

      // trazimo koji je dan u nedelji un pitanju: 0 = nedelja, 1 = ponedeljak, ..., 6 = subota
      const dayOfWeek = moment(date).format('d');

      // trazimo koji je prvi sledeci dan kada je taj dan u nedelji, pocev od danas (ukljucujuci i danas)
      const choice = moment();
      while (choice.format('d') !== dayOfWeek) {
        choice.add(1, 'day');
      }

      // u niz guramo 4 datuma
      for (let i = 0; i < 4; i++) {
        ret.push(choice.clone().format('YYYY-MM-DD'));
        choice.add(+period, 'week');
      }
    }
    this.dateChoices = ret;
    this.announcement.startDate = this.dateChoices[0];
    return ret;
  }


  save() {
    const timespan: TimeSpan = new TimeSpan;
    timespan.startDate = new Date(this.announcement.startDate);
    timespan.endDate = new Date(this.announcement.endDate);
    timespan.period = 0;


    this.groupsService.addActivity(
      this.group.GroupId,
      null, // classroom
      null, // place
      this.announcement.title,
      this.announcement.content,
      timespan
    )
      .then(response => {
        switch (response.status) {
          case 'success':
            this.openSnackBar(this.translate.instant('successfully_added_announcement'));
            this.close();
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('announcement_not_added'));
            debugger;
            break;
        }
      });


  }

}
