import {Component, OnInit} from '@angular/core';
import {TimetableType} from '../../shared/timetable-type.enum';

@Component({
  selector: 'app-student-panel',
  templateUrl: './student-panel.component.html',
  styleUrls: ['./student-panel.component.scss']
})
export class StudentPanelComponent implements OnInit {

  public timetableType: TimetableType = TimetableType.Official;
  public _TimetableType = TimetableType;
  constructor() { }

  ngOnInit() {
  }

  get leftOffset() {
    const ret =  this.timetableType * 100;
    return ret + 'px';
  }
}
