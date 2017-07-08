import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Group} from '../../models/Group';
import {TimeSpan} from '../../models/TimeSpan';
import {AuthService} from '../../login/auth.service';

@Injectable()
export class GroupsService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private groupsUrl = 'http://localhost:55281/api/Groups';  // URL to web api

  constructor(private http: Http,
              private authService: AuthService) { }


  getGroup(groupId: number): Promise<Group> {
    return this.authService.authGet(this.groupsUrl + '/GetGroup/' + groupId);
  }

  updateGroup(groupID: number, divisionID: number, assistantID: number,
              name: string, classroomID: number, timespan: any, students: Array<number>) {
    const body = JSON.stringify({
      groupID: groupID,
      name: name,
      classroomID: classroomID,
      students: students,
      divisionID: divisionID,
      assistantID: assistantID,
      timespan: timespan
    });
    console.log(body);
    /*debugger;*/

    return this.authService.authPost(this.groupsUrl + '/Update', body);
  }


  removeGroup(groupId: number) {
    return this.http.delete(this.groupsUrl + '/DeleteGroups/' + groupId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  addActivity(groupId: number, classroomId: number, place: string, title: string, content: string, timespan: TimeSpan) {
    const body = JSON.stringify({
      groupID: groupId,
      classroomID: classroomId,
      place: place,
      title: title,
      content: content,
      timespan: timespan
    });
    console.log(body);
    return this.authService.authPost(this.groupsUrl + '/AddActivity', body);
  }

  cancelClass(groupID: number, title: string, content: string, timespan: TimeSpan) {
    const body = JSON.stringify({
      groupID: groupID,
      title: title,
      content: content,
      timespan: timespan
    });
    console.log(body);
    return this.authService.authPost(this.groupsUrl + '/CancelClass', body);
  }

  unCancelClass(activityID: number): Promise<any[]> {
    return this.authService.authGet(this.groupsUrl + `/UnCancelClass/?activityID=${activityID}`);
  }

  getCanceledTimes(groupID: number): Promise<any[]> {
    return this.http.get(this.groupsUrl + `/GetCanceledTimes/?groupID=${groupID}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getSchedule(groupID: number, weeksFromNow: number): Promise<any[]> {
    return this.http.get(this.groupsUrl + `/GetSchedule/?groupID=${groupID}&weeksFromNow=${weeksFromNow}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  /**
   * GET: api/Groups/GetGroups/{division-id}
   * Uzima grupe koje pripadaju smeru čiji je ID prosleðen kao parametar.
   */
  getGroups(divisionID: number): Promise<Group[]> {
    return this.http.get(this.groupsUrl + '/GetGroups/' + divisionID)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  massGroupEdit(sendData: any) {
    const body = JSON.stringify({
      groups: sendData
    });
    console.log(body);

    const options = new RequestOptions({headers: this.headers});
    return this.http.post(this.groupsUrl + '/MassGroupEdit', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  //////// BulletinBoard ///////////

  getAllBulletinBoardChoices(groupId: number): Promise<Group> {
    return this.authService.authGet(this.groupsUrl + '/GetAllBulletinBoardChoices/' + groupId);
  }

  getPossibleBulletinBoardChoices(groupId: number): Promise<Group> {
    return this.authService.authGet(this.groupsUrl + '/GetPossibleBulletinBoardChoices/' + groupId);
  }

  exchangeStudents(groupId: number, adID: number): Promise<Group> {
    return this.authService.authGet(this.groupsUrl + `/ExchangeStudents/?groupID=${groupId}&adID=${adID}`);
  }

  addAd(groupID: number, groupIDs: any) {
    const body = JSON.stringify({
      groupID: groupID,
      groupIDs: groupIDs
    });
    console.log(body);

    return this.authService.authPost(this.groupsUrl + '/AddEditAd', body);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
