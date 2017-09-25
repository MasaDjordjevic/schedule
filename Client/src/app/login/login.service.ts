import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthService} from './auth.service';
import {AppSettings} from '../shared/AppSettings';

@Injectable()
export class LoginService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private classroomsUrl = 'http://schedule-server.azurewebsites.net/api/Classrooms';  // URL to web api

  private serverUrl = AppSettings.API_ENDPOINT;

  constructor(private http: Http,
  private authService: AuthService) { }


  login(username: string, password: string): Promise<any> {
     return this.authService.login(username, password);
  }

  loginRedirect() {
    return this.http.get(this.serverUrl + '/api/Login/LoginRedirect/')
      .toPromise()
      .then((res) => res.json());
  }

  logout() {
    sessionStorage.clear();
    return this.authService.authGet(this.serverUrl + '/api/Login/Logout');
  }

  getUser() {
    return this.authService.authGet(this.serverUrl + '/api/Login/GetUser');
  }

  getUserInfo(): Promise<any> {
    return this.authService.authGet(this.serverUrl + '/api/Login/proba')
      .then(res => console.log(res));
  }

  getUserInfo2(): Promise<any> {
    return this.authService.authGet(this.serverUrl + '/api/Divisions/proba')
      .then(res => console.log(res));
  }

  probaPost(): Promise<any> {
    const body = JSON.stringify({
      'divisionID': -5,
      'name': 'testtestsetse',
      'beginning': new Date(),
      'ending': new Date(),
      'divisionTypeID': 1,
      'courseID': 10,
    });
    return this.authService.authPost(this.serverUrl + '/api/Divisions/probaPost', body)
      .then(res => console.log(res));

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


}
