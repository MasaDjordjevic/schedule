import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private loginUrl = 'http://localhost:55281/api/Login/Login';
  private tokenKey = 'token';
  private token: string;

  constructor(private http: Http) { }

  login(username: string, password: string): Promise<any> {
    const body = JSON.stringify({
      'username': username,
      'password': password
    });

    return this.authPost(this.loginUrl, body)
      .then(res => {
        let a = res.data;
        sessionStorage.setItem(this.tokenKey, res.data.accessToken);
      })
  }

  private getLocalToken(): string {
    if (!this.token) {
      this.token = sessionStorage.getItem(this.tokenKey);
    }
    return this.token;
  }

  public initAuthHeaders(): Headers {
    const token = this.getLocalToken();
    if (token == null) {
      throw new Error('No token');
    }

    const headers =  new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', 'Bearer ' + token);

    return headers;
  }

  authPost(url: string, body: any): Promise<any> {
    const headers = this.initAuthHeaders();
    return this.http.post(url, body, {headers: headers}).toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  authGet(url): Promise<any> {
    const headers = this.initAuthHeaders();
    return this.http.get(url, {headers: headers}).toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}