import {Component, OnInit} from '@angular/core';
import {GroupsService} from '../../../shared/services/groups.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as moment from 'moment';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DeleteGroupComponent} from '../../dialogs/delete-group/delete-group.component';
import {MdDialog, MdSnackBar} from '@angular/material';
import {AddAnnouncementComponent} from '../../dialogs/add-announcement/add-announcement.component';
import {EditGroupComponent} from '../../dialogs/edit-group/edit-group.component';
import {CancelClassComponent} from '../../dialogs/cancel-class/cancel-class.component';
import {AddActivityComponent} from '../../dialogs/add-activity/add-activity.component';

@Component({
  selector: 'app-group-options',
  templateUrl: './group-options.component.html',
  styleUrls: ['../panel-options/panel-options.component.scss', './group-options.component.scss']
})
export class GroupOptionsComponent implements OnInit {
  groupId: number;
  departmentId: number;
  divisionId: number;
  group: any;
  errorMessage: string;

  constructor(private groupsService: GroupsService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              public snackBar: MdSnackBar,
              public dialog: MdDialog) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.groupId = +params['groupId'];
        this.divisionId = +params['divisionId'];
        this.departmentId = +params['departmentId'];
        this.getGroup();
      });
  }

  getGroup(): void {
    if (!this.groupId) {
      return;
    }
    this.groupsService.getGroup(this.groupId).then(
      group => this.group = group,
      error => this.errorMessage = <any>error
    );
  }

  get descriptiveString() {
    if (!this.group.TimeSpan) {
      return this.translate.instant('duration_not_set');
    }

    const period = +this.group.TimeSpan.Period;

    // cas se desava samo jednom
    if (period === 0) {
      const start = moment(this.group.TimeSpan.StartDate);
      const end = moment(this.group.TimeSpan.EndDate);

      return `${start.format('YYYY-MM-DD, HH:mm')} — ${end.format('YYYY-MM-DD, HH:mm')}`;
    } else {
      // cas se desava periodicno
      const start = moment(this.group.TimeSpan.StartDate);
      const end = moment(this.group.TimeSpan.EndDate);

      // tražimo dan
      const day = start.day(); // 0 nedelja, 1 ponedeljak, ..., 6 subota
      const modifier = period === 1 ? '' :
        period === 2 ? this.translate.instant('second__acc') :
          this.translate.instant('fourth__acc');

      const dayName =
        day === 0 ? this.translate.instant('sunday') :
          day === 1 ? this.translate.instant('monday') :
            day === 2 ? this.translate.instant('tuesday') :
              day === 3 ? this.translate.instant('wednesday') :
                day === 4 ? this.translate.instant('thursday') :
                  day === 5 ? this.translate.instant('friday') :
                    this.translate.instant('saturday');

      return this.translate.instant('duration_descriptive_string__1') +
        modifier +
        this.translate.instant('duration_descriptive_string__2') +
        dayName +
        this.translate.instant('duration_descriptive_string__3') +
        start.format('HH:mm') +
        this.translate.instant('duration_descriptive_string__4') +
        end.format('HH:mm');
    }

  }

  openDeleteGroupDialog() {
    const dialogRef = this.dialog.open(DeleteGroupComponent, {data: {group: this.group}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.router.navigate(['/assistant', {
          departmentId: this.departmentId,
          divisionId: this.divisionId
        }]);
      }
    });
  }

  openAddActivityDialog() {
    const dialogRef = this.dialog.open(AddActivityComponent, {data: {group: this.group}});
  }

  openEditGroupDialog() {
    const dialogRef = this.dialog.open(EditGroupComponent, {data: {group: this.group}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.router.navigate(['/assistant', {
          departmentId: this.departmentId,
          divisionId: this.divisionId,
        }]);
      }
    });
  }

  openCancelClassDialog() {
    const dialogRef = this.dialog.open(CancelClassComponent, {data: {group: this.group}});
  }

}
