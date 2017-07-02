import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {GroupsService} from '../../services/groups.service';
import {ClassroomsService} from '../../services/classrooms.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {ThemeService} from '../../services/theme.service';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {TimeSpan} from '../../../models/TimeSpan';

@Component({
  selector: 'app-cancel-class',
  templateUrl: './cancel-class.component.html',
  styleUrls: ['./cancel-class.component.scss']
})
export class CancelClassComponent implements OnInit {
  @Input() group: any;
  @HostBinding('class') themeClass = this.theme;

  cancel: any = {
    title: '',
    content: '',
  };
  dateChoices: string[];

  constructor(public groupsService: GroupsService,
              public classroomsService: ClassroomsService,
              public dialogRef: MdDialogRef<CancelClassComponent>,
              public snackBar: MdSnackBar,
              private themeService: ThemeService,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.group = data.group;
    if (this.group.TimeSpan) {
      this.listDateChoices(this.group.TimeSpan, this.group.TimeSpan.Period);
    }
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

  // iskopirano u group-add-activity.component.ts
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
    this.cancel.startDate = this.dateChoices[0];
    return ret;
  }

  cancelClass() {
    const timespan: TimeSpan = new TimeSpan;
    timespan.startDate = this.cancel.startDate;
    timespan.endDate = this.cancel.startDate;
    timespan.period = 0;
    this.groupsService.cancelClass(this.group.GroupId, this.cancel.title, this.cancel.content, timespan)
      .then(response => {
        switch (response.status) {
          case 'success':
            this.openSnackBar(this.translate.instant('class_successfully_canceled'));
            break;
          case 'error':
            switch (response.message) {
              case 'Čas je već otkazan.':
                this.openSnackBar(this.translate.instant('class_already_canceled'));
                break;
              default:
                this.openSnackBar(this.translate.instant('error') + ' ' +
                  this.translate.instant('class_not_canceled'));
                debugger;
                break;
            }
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('class_not_canceled'));
            debugger;
            break;
        }
      })
      .then(() => {
        this.close();
      });
  }

}
