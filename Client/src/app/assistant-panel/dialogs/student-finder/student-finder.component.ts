import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-student-finder',
  templateUrl: './student-finder.component.html',
  styleUrls: ['./student-finder.component.scss']
})
export class StudentFinderComponent implements OnInit {
  @HostBinding('class') @Input() primaryColor = 'material-primary';
  @Input() students: any[];
  @Input() columns = 1;


  query: string;
  private filteredStudents: any[];

  get columnClassName() {
    switch (this.columns) {
      case 1:
        return 'wide';
      case 2:
        return 'normal';
      case 3:
        return 'narrow';
    }
    return 'wide';
  }

  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this.students = data.students;
    this.filteredStudents = data.students;
    console.log(this.students);
  }

  filterStudents() {
    this.filteredStudents = this.students.filter(student => {
      if ((student.UniMembers.Name.indexOf(this.query) < 0) &&
        (student.UniMembers.Surname.indexOf(this.query) < 0) &&
        (student.UniMembers.Email.indexOf(this.query) < 0) &&
        (student.IndexNumber.toString().indexOf(this.query) < 0)) {
        return false;
      }

      return true;
    });


  }

  ngOnInit() {
  }

}
