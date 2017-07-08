import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-timetable-dialog',
  templateUrl: './timetable-dialog.component.html',
  styleUrls: ['./timetable-dialog.component.scss']
})
export class TimetableDialogComponent implements OnInit {

  departmentId: number;
  groupId: number;

  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this.departmentId = data.departmentId;
    this.groupId = data.groupId;
  }

  ngOnInit() {
  }

}
