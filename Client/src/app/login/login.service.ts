import {Injectable} from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private loginUrl = 'http://localhost:55281/api/Login/Login';
  private classroomsUrl = 'http://localhost:55281/api/Classrooms';  // URL to web api

  constructor(private http: Http) { }


  login(username: string, password: string): Promise<any> {

    const body = JSON.stringify({
      'username': username,
      'password': password
    });

    const body2 = JSON.stringify({
      'ClassroomId': 15,
      'Number': 322
    });
    return this.http
      .post(this.loginUrl, body, {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
