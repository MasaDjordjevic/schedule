import {Component, OnInit} from '@angular/core';
import {TimetableType} from '../timetable-type.enum';

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
    console.log(ret);
    return ret + 'px';
  }
}
