import {Component, DoCheck, Inject, Input, OnChanges, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {RefreshTimetableService} from '../../../shared/refresh-timetable.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements DoCheck {

  @Input() beginningMinutes = 480; // npr. 07:00 je 420
  @Input() endingMinutes = 1200; // npr. 20:00 je 1200
  @Input() showEvery = 15; // npr. prikǎzi liniju na svakih 15 minuta
  @Input() scale = 2.2; // koliko piksela je jedan minut
  @Input() displayDay: Array<boolean> = [true, true, true, true, true, true, false];
  @Input() dayNames: string[];

  constructor(public refreshTimetableService: RefreshTimetableService,
              public translate: TranslateService,
              public dialogRef: MdDialogRef<SettingsComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.beginningMinutes = data.beginningMinutes;
    this.endingMinutes = data.endingMinutes;
    this.showEvery = data.showEvery;
    this.scale = data.scale;
    this.displayDay = data.displayDay;
    this.dayNames = data.dayNames.map(d => translate.instant(d));


  }

  ngDoCheck(): void {
      this.refreshTimetableService.settings({
        beginningMinutes: this.beginningMinutes,
        endingMinutes: this.endingMinutes,
        showEvery: this.showEvery,
        scale: this.scale,
        displayDay: this.displayDay,
        dayNames: this.dayNames
      });
  }


}
