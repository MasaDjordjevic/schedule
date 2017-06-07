import { Component, OnInit } from '@angular/core';
import {ClassroomsService} from './classrooms.service';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.scss']
})
export class ClassroomsComponent implements OnInit {
  classrooms: any;
  constructor(private classroomsService: ClassroomsService) { }

  ngOnInit() {
    this.classroomsService.getClassrooms()
      .then(classrooms => this.classrooms = classrooms)
  }

}
