import {Component, Input, OnInit} from '@angular/core';
import {Mode} from '../mode.enum';

@Component({
  selector: 'app-timetable-class',
  templateUrl: './timetable-class.component.html',
  styleUrls: ['./timetable-class.component.scss']
})
export class TimetableClassComponent implements OnInit {

  @Input() mode: Mode;
  public _Mode = Mode;

  public message: string;

  // Vremena za računanje
  @Input() startMinutes: number; // npr. 07:15 je 435
  @Input() endMinutes: number; // npr. 07:15 je 435
  @Input() durationMinutes: number; // npr. 45

  // Opšti podaci o času
  @Input() classId: number; // groupId
  @Input() className: string; // "Objektno-orijentisano programiranje"
  @Input() isClass: boolean; // true = class, false = activity
  @Input() abbr: string; // "OOP"
  @Input() classroom: string; // "431", "A1"
  @Input() assistant: string; // "Vladan Mihajlovitj"
  @Input() activityId: number;
  @Input() activityTitle: string; // "Teretana"
  @Input() activityContent: string; // "Samo džim bajo moj"
  @Input() active = true; // true: defaultno, false: zasivljeno
  @Input() type = 'predavanje';
  @Input() place: string; // za globalne aktivnosti
  @Input() notifications: {activityContent: string, activityID: number, classroomID: number, place: string, title: string}[];

  // Prikaz
  @Input() color: string;

  get textColor(): string {
    switch (this.color) {
      case 'MaterialYellow':
        return 'black';
      default:
        return 'white';
    }
  }


  ngOnInit() {
  }

}
