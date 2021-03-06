import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {TimeSpan} from '../../models/TimeSpan';
import {Student} from '../../models/Student';
import {AuthService} from '../../login/auth.service';
import {AppSettings} from '../AppSettings';


@Injectable()
export class StudentsService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private studentsUrl = AppSettings.API_ENDPOINT + '/api/Students';  // URL to web api

  constructor(private http: Http,
              private authService: AuthService) { }


  getStudent(studentId: number): Promise<Student> {
    return this.http.get(this.studentsUrl + '/GetStudent/' + studentId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  /**
   * GET: api/Students/GetStudents/{groupId}
   * Uzmi studente koji pripadaju grupi sa prosleðenim ID-jem.
   */
  getStudents(groupId: number): Promise<Student[]> {
    return this.http.get(this.studentsUrl + '/GetStudents/' + groupId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  /**
   * GET: api/Students/GetStudentsOfDepartment/{departmentId}
   * Uzmi studente koji pripadaju smeru (department) sa prosleðenim ID-jem.
   */
  getStudentsOfDepartment(departmentID: number): Promise<Student[]> {
    return this.http.get(this.studentsUrl + '/GetStudentsOfDepartment/' + departmentID)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getStudentsOfCourse(courseId: number): Promise<any[]> {
    return this.authService.authGet(this.studentsUrl + '/GetStudentsOfCourse/' + courseId);
  }

  moveToGroup(studentID: number, groupID: number): Promise<any[]> {
    return this.authService.authGet(this.studentsUrl + `/MoveToGroup?studentID=${studentID}&groupID=${groupID}`);
  }

  getSchedule(studentID: number, weeksFromNow: number): Promise<any[]> {
    return this.http.get(this.studentsUrl + `/GetSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getPersonalSchedule(studentID: number, weeksFromNow: number): Promise<any[]> {
    return this.http.get(this.studentsUrl + `/GetPersonalSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getOfficialSchedule(studentID: number, weeksFromNow: number): Promise<any[]> {
    return this.http.get(this.studentsUrl + `/GetOfficialSchedule/?studentID=${studentID}&weeksFromNow=${weeksFromNow}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  removeFromGroup(studentID: number, groupID: number): Promise<any[]> {
    return this.authService.authGet(this.studentsUrl + `/RemoveFromGroup/?studentID=${studentID}&groupID=${groupID}`);
  }

  hideClass(groupID: number): Promise<any[]> {
    return this.authService.authGet(this.studentsUrl + `/HideClass/?groupID=${groupID}`);
  }

  unhideClass(groupID: number): Promise<any[]> {
    return this.authService.authGet(this.studentsUrl + `/AddClassToPersonalSchedule/?groupID=${groupID}`);
  }

  alertClass(groupID: number): Promise<any[]> {
    return this.http.get(this.studentsUrl + `/AlertClass/?groupID=${groupID}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  public addActivity(groupId: number, classroomId: number, place: string,
                     title: string, content: string, timespan: TimeSpan) {
    const body = JSON.stringify({
      'classroomID': classroomId,
      'timeSpan': timespan,
      'place': place,
      'title': title,
      'content': content,
      'groupID': groupId
    });
    console.log(body);
    return this.authService.authPost(this.studentsUrl + '/AddActivity', body);
  }

  deleteActivity(activityID: number): Promise<any[]> {
    return this.http.get(this.studentsUrl + `/DeleteActivity/?activityID=${activityID}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  alertActivity(activityID: number): Promise<any[]> {
    return this.http.get(this.studentsUrl + `/AlertActivity/?activityID=${activityID}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
