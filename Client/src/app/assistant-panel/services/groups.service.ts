import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Group} from '../../models/Group';
import {TimeSpan} from '../../models/TimeSpan';

@Injectable()
export class GroupsService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private groupsUrl = 'http://localhost:55281/api/Groups';  // URL to web api

  constructor(private http: Http) { }


  getGroup(groupId: number): Promise<Group> {
    return this.http.get(this.groupsUrl + '/GetGroup/' + groupId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
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

    const options = new RequestOptions({headers: this.headers});
    return this.http.post(this.groupsUrl + '/Update', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }


  removeGroup(groupId: number) {
    return this.http.delete(this.groupsUrl + '/DeleteGroups/' + groupId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  addActivity(groupID: number, classroomID: number, place: string, title: string, content: string, timespan: TimeSpan) {
    const body = JSON.stringify({
      groupID: groupID,
      classroomID: classroomID,
      place: place,
      title: title,
      content: content,
      timespan: timespan
    });
    console.log(body);

    const options = new RequestOptions({headers: this.headers});
    return this.http.post(this.groupsUrl + '/AddActivity', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  cancelClass(groupID: number, title: string, content: string, timespan: TimeSpan) {
    const body = JSON.stringify({
      groupID: groupID,
      title: title,
      content: content,
      timespan: timespan
    });
    console.log(body);

    const options = new RequestOptions({headers: this.headers});
    return this.http.post(this.groupsUrl + '/CancelClass', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  unCancelClass(activityID: number): Promise<any[]> {
    return this.http.get(this.groupsUrl + `/UnCancelClass/?activityID=${activityID}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
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
    return this.http.get(this.groupsUrl + '/GetAllBulletinBoardChoices/' + groupId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getPossibleBulletinBoardChoices(groupId: number): Promise<Group> {
    return this.http.get(this.groupsUrl + '/GetPossibleBulletinBoardChoices/' + groupId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  exchangeStudents(groupId: number, adID: number): Promise<Group> {
    return this.http.get(this.groupsUrl + `/ExchangeStudents/?groupID=${groupId}&adID=${adID}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  addAd(groupID: number, groupIDs: any) {
    const body = JSON.stringify({
      groupID: groupID,
      groupIDs: groupIDs
    });
    console.log(body);

    const options = new RequestOptions({headers: this.headers});
    return this.http.post(this.groupsUrl + '/AddEditAd', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
