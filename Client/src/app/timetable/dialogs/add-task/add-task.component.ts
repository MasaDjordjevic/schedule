import {Component, Inject, Input, OnInit} from '@angular/core';
import {GroupsService} from '../../../shared/services/groups.service';
import * as moment from 'moment';
import {ClassroomsService} from '../../../shared/services/classrooms.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {TimeSpan} from '../../../models/TimeSpan';
import {StudentsService} from '../../../shared/services/students.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  group: any;
  private classrooms;
  courses: any[];
  private errorMessage;

  dateChoices: string[];

  private _groupId = 0;

  private task: any = {
    title: null,
    content: null,
    classroomId: null,
    place: null
  };

  @Input() set groupId(n: number) {
    this._groupId = n;
    this.getGroup();
  }

  get groupId() {
    return this._groupId;
  }

  constructor(private groupsService: GroupsService,
              private classroomsService: ClassroomsService,
              private studentsService: StudentsService,
              public dialogRef: MdDialogRef<AddTaskComponent>,
              public snackBar: MdSnackBar,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.groupId = data.groupId;
  }

  ngOnInit() {
    this.getClassrooms();
  }

  getClassroomNumber(id: number) {
    if (!this.classrooms || !id) {
      return '';
    }
    return this.classrooms.find(c => c.classroomId === id).number;
  }

  getGroup(): void {
    this.groupsService.getGroup(this.groupId).then(
      group => this.group = group,
      error => this.errorMessage = <any>error
    )
      .then(() => this.group.TimeSpan && this.listDateChoices(this.group.TimeSpan, this.group.TimeSpan.Period));
  }

  // iskopirano iz cancel-class.componenet
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
    this.task.startDate = this.dateChoices[0];
    return ret;
  }

  getClassrooms() {
    this.classroomsService.getClassrooms()
      .then(
        cls => this.classrooms = cls,
        error => this.errorMessage = <any>error);
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  close(message: string = null) {
    this.dialogRef.close(message);
  }


  save() {
    const timespan: TimeSpan = new TimeSpan;
    timespan.startDate = this.task.startDate;
    timespan.endDate = this.task.startDate;
    timespan.period = 0;

    this.studentsService.addActivity(
      this.group.groupID,
      this.task.classroomId,
      this.task.place,
      this.task.title,
      this.task.content,
      timespan
    )
      .then(response => {
        console.log(response);
        switch (response.status) {
          case 'uspelo':
            this.openSnackBar(this.translate.instant('add_task_successful'));
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
            this.translate.instant('add_task_unsuccessful'));
            debugger;
            break;
        }
      })
      .then(() => {
        this.close();
      });
  }
}
