import {Injectable} from '@angular/core';
import {Department} from '../../models/Department';
import {Http, Headers, RequestOptions} from '@angular/http';
import {YearDepartments} from '../../models/YearDepartments';



@Injectable()
export class DepartmentsService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private departmentsUrl = 'http://localhost:55281/api/Departments';  // URL to web api

  constructor(private http: Http) { }


  getDepartment(id: number): Promise<Department> {
    return this.http.get(this.departmentsUrl + '/GetDepartments/' + id)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getDepartments(): Promise<Department[]> {
    return this.http.get(this.departmentsUrl + '/GetDepartments')
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  getDepartmentsByYear(): Promise<YearDepartments[]> {
    return this.http.get(this.departmentsUrl + '/GetDepartmentsByYear')
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  addDepartment(departmentName: string, year: number): Promise<Department> {
    const body = JSON.stringify({departmentName, year});
    const options = new RequestOptions({ headers: this.headers });
    return this.http.post(this.departmentsUrl + '/PostDepartments', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteDepartment(departmentID: number) {
    const options = {headers: this.headers};
    return this.http.delete(this.departmentsUrl + '/DeleteDepartments/' + departmentID, options)
      .toPromise().then(res => res.json()).catch(this.handleError);
  }

  getSchedule(departmentID: number, weeksFromNow: number): Promise<any[]> {
    return this.http.get(this.departmentsUrl + `/GetSchedule/?departmentID=${departmentID}&weeksFromNow=${weeksFromNow}`)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
