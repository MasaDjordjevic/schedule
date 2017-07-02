import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-students-selector',
  templateUrl: './students-selector.component.html',
  styleUrls: ['./students-selector.component.scss']
})
export class StudentsSelectorComponent implements OnInit {

  @Input() students: any;
  @Input() checked: any;
  @Input() query: any;
  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  get filteredStudents() {
    if (!this.students) {
      return [];
    }
    if (!this.query || this.query.lenght <= 0) {
      return this.students;
    }

    return this.students.filter(student => {
      if ((student.UniMembers.Name.indexOf(this.query) < 0) &&
        (student.UniMembers.Surname.indexOf(this.query) < 0) &&
        (student.UniMembers.Email.indexOf(this.query) < 0) &&
        (student.IndexNumber.toString().indexOf(this.query) < 0)) {
        return false;
      }
      return true;
    });


  }

  studentClicked(student) {
    this.onSelectionChange.emit(student);
  }

}
