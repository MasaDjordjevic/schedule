import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {GroupsService} from '../../../shared/services/groups.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {ThemeService} from '../../../shared/theme.service';
import {TranslateService} from '@ngx-translate/core';
import {ClassroomsService} from '../../../shared/services/classrooms.service';
import {TimeSpan} from '../../../models/TimeSpan';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss']
})
export class AddAnnouncementComponent implements OnInit {

  @Input() group: any;
  @HostBinding('class') themeClass = this.theme;

  private classrooms;
  courses: any[];
  private errorMessage;

  announcement: { title: string, content: string, startDate: any, endDate: any, classroomId: number, place: string }
    = <any>{};

  constructor(public groupsService: GroupsService,
              public classroomsService: ClassroomsService,
              public dialogRef: MdDialogRef<AddAnnouncementComponent>,
              public snackBar: MdSnackBar,
              private themeService: ThemeService,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.group = data.group;
    this.getClassrooms();
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
      endDate: null,
      classroomId: null,
      place: ''
    };
  }

  getClassrooms() {
    this.classroomsService.getClassrooms()
      .then(
        cls => this.classrooms = cls,
        error => this.errorMessage = <any>error
          .then(() => this.announcement.classroomId = this.classrooms[0].classroomId));
  }

  getClassroomNumber(id: number) {
    if (!this.classrooms || !id) {
      return '';
    }
    return this.classrooms.find(c => c.classroomId === id).number;
  }

  save() {
    const timespan: TimeSpan = new TimeSpan;
    timespan.startDate = new Date(this.announcement.startDate);
    timespan.endDate = new Date(this.announcement.endDate);
    timespan.period = 0;


    this.groupsService.addActivity(
      this.group.GroupId,
      this.announcement.classroomId,
      this.announcement.place,
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
