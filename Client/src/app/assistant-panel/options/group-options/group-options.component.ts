import {Component, OnInit} from '@angular/core';
import {GroupsService} from '../../services/groups.service';
import {ActivatedRoute, Params} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-group-options',
  templateUrl: './group-options.component.html',
  styleUrls: ['../panel-options/panel-options.component.scss', './group-options.component.scss']
})
export class GroupOptionsComponent implements OnInit {
  groupId: number;
  group: any;
  errorMessage: string;

  constructor(private groupsService: GroupsService,
              private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.groupId = +params['groupId'];
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
    debugger;
    if (!this.group.TimeSpan) {
      return 'Nije dodeljeno vreme trajanja.';
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
        period === 2 ? 'second__acc' :
          'fourth__acc';

      const dayName =
        day === 0 ? 'sunday' :
          day === 1 ? 'monday__acc' :
            day === 2 ? 'tuesday__acc' :
              day === 3 ? 'wednesday__acc' :
                day === 4 ? 'thursday__acc' :
                  day === 5 ? 'friday__acc' :
                    'saturday__acc';

      return 'duration_descriptive_string__1' +
        modifier +
        'duration_descriptive_string__2' +
        dayName +
        'duration_descriptive_string__3' +
        start.format('HH:mm') +
        'duration_descriptive_string__4' +
        end.format('HH:mm');
    }

  }

}
