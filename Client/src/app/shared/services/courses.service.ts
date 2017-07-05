import {Injectable} from '@angular/core';
import {Department} from '../../models/Department';
import {Http, Headers, RequestOptions} from '@angular/http';
import {YearDepartments} from '../../models/YearDepartments';
import {Course} from '../../models/Course';

@Injectable()
export class CoursesService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private coursesUrl = 'http://localhost:55281/api/Courses';  // URL to web api

  constructor(private http: Http) { }

  getCourses(): Promise<Course[]> {
    return this.http.get(this.coursesUrl)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  addCourse(code: string, alias: string, name: string, departmentID: number, semester: number): Promise<Course> {
    const body = JSON.stringify({code, alias, name, departmentID, semester});
    const options = new RequestOptions({headers: this.headers});

    return this.http.post(this.coursesUrl + '/PostCourses', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  deleteCourse(courseID: number) {
    const options = new RequestOptions({headers: this.headers});
    return this.http.delete(this.coursesUrl + '/DeleteCourses/' + courseID, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  // Vrati predmete (courses) koji odgovaraju prosledjenom smeru (department).
  // [GET] api/Courses/GetCoursesOfDepartment/{department-id}
  getCoursesOfDepartment(departmentID: number): Promise<Course[]> {
    return this.http.get(this.coursesUrl + '/GetCoursesOfDepartment/' + departmentID)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
