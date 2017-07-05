import {Injectable} from '@angular/core';
import {AuthService} from '../../login/auth.service';
import {Http} from '@angular/http';

@Injectable()
export class ClassroomsService {
  private classroomsUrl = 'http://localhost:55281/api/Classrooms';  // URL to web api

  constructor(private http: Http,
              private authService: AuthService) { }


  getClassrooms(): Promise<any[]> {
    return this.authService.authGet(this.classroomsUrl + '/getClassrooms');
  }

  addClassroom(number: string, projector: boolean, sunnySide: boolean): Promise<any> {
    const body = JSON.stringify({number, projector, sunnySide});
    return this.authService.authPost(this.classroomsUrl + '/PostClassrooms', body);
  }

  getSchedule(classroomId: number, weeksFromNow: number): Promise<any[]> {
    return this.authService.authGet(this.classroomsUrl + `/GetSchedule/?classroomID=${classroomId}&weeksFromNow=${weeksFromNow}`);
  }
}
