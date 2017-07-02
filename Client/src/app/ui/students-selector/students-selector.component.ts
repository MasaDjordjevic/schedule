import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-students-selector',
  templateUrl: './students-selector.component.html',
  styleUrls: ['./students-selector.component.scss']
})
export class StudentsSelectorComponent implements OnInit {

  @Input() students: any;
  @Input() checked: any;
  @Output() onSelectionChange:  EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  studentClicked(student) {
    this.onSelectionChange.emit(student);
  }

}
