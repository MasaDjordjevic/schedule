import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthService} from './auth.service';

@Injectable()
export class LoginService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private classroomsUrl = 'http://localhost:55281/api/Classrooms';  // URL to web api

  constructor(private http: Http,
  private authService: AuthService) { }


  login(username: string, password: string): Promise<any> {
     return this.authService.login(username, password);
  }

  loginRedirect() {
    return this.authService.authGet('http://localhost:55281/api/Login/LoginRedirect');
  }

  getUser() {
    return this.authService.authGet('http://localhost:55281/api/Login/GetUser');
  }

  getUserInfo(): Promise<any> {
    return this.authService.authGet('http://localhost:55281/api/Login/proba')
      .then(res => console.log(res));
  }

  getUserInfo2(): Promise<any> {
    return this.authService.authGet('http://localhost:55281/api/Divisions/proba')
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
    return this.authService.authPost('http://localhost:55281/api/Divisions/probaPost', body)
      .then(res => console.log(res));

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


}
