import {Component, Inject, Input, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {Student} from '../../../models/Student';

@Component({
  selector: 'app-student-finder',
  templateUrl: './student-finder.component.html',
  styleUrls: ['./student-finder.component.scss']
})
export class StudentFinderComponent implements OnInit {
  @Input() primaryColor = 'material-primary';
  @Input() students: Student[];
  @Input() columns = 1;

  get columnClassName() {
    switch (this.columns) {
      case 1: return 'wide';
      case 2: return 'normal';
      case 3: return 'narrow';
    }
    return 'wide';
  }
  constructor( @Inject(MD_DIALOG_DATA) public data: any) {
    this.students = data.students;
    console.log(this.students);
  }

  ngOnInit() {
  }

}
