import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private loginUrl = 'http://localhost:55281/api/Login/Login';
  private classroomsUrl = 'http://localhost:55281/api/Classrooms';  // URL to web api
  private tokenKey = 'token';
  private token: string;

  constructor(private http: Http) { }


  login(username: string, password: string): Promise<any> {
    const body = JSON.stringify({
      'username': username,
      'password': password
    });

    return this.http
      .post(this.loginUrl, body, {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .then(res => {
        let a = res.data;
        sessionStorage.setItem(this.tokenKey, res.data.accessToken);
      })
      .catch(this.handleError);
  }

  getUserInfo(): Promise<any> {
    return this.authGet('http://localhost:55281/api/Login/proba');
  }

  getUserInfo2(): Promise<any> {
    return this.authGet('http://localhost:55281/api/Divisions/proba');
  }

  authGet(url): Promise<any> {
    const headers = this.initAuthHeaders();
    console.log(headers);
    return this.http.get(url, { headers: headers }).toPromise()
      .then(response => response.json() as any)
      .then(res =>  {
        console.log(res);
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private getLocalToken(): string {
    if (!this.token) {
      this.token = sessionStorage.getItem(this.tokenKey);
    }
    return this.token;
  }

  public initAuthHeaders(): Headers {
    const token = this.getLocalToken();
    if (token == null) throw new Error('No token');

    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return headers;
  }
}
