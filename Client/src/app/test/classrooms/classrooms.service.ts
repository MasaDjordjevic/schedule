import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClassroomsService {
  private headers = new Headers({'Content-Type': 'application/json'});
  classroomsUrl = 'http://localhost:55281/api/Classrooms';  // URL to web api
  constructor(private http: Http) { }


  getClassrooms(): Promise<any[]> {
    return this.http.get(this.classroomsUrl + '/GetClassrooms')
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getClassroom(id: number): Promise<any> {
    const url = `${this.classroomsUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.classroomsUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(name: string): Promise<any> {
    return this.http
      .post(this.classroomsUrl, JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
