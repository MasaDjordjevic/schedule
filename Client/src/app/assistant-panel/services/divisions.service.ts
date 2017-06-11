import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Division} from '../../models/Division';
import {TypeDivisions} from '../../models/TypeDivisions';


@Injectable()
export class DivisionsService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private divisionsUrl = 'http://localhost:55281/api/Divisions';  // URL to web api

  constructor(private http: Http) { }

  public getDivision(id: number): Promise<Division> {
    return this.http.get(this.divisionsUrl + '/GetDivision/' + id)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  public updateDivision(divisionId, name, beginning, ending, divisionTypeID, courseID) {
    const body = JSON.stringify({
      'divisionID': divisionId,
      'name': name,
      'beginning': new Date(beginning),
      'ending': new Date(ending),
      'divisionTypeID': divisionTypeID,
      'courseID': courseID,
    });
    console.log(body);
    const options = new RequestOptions({ headers: this.headers });
    return this.http.post(this.divisionsUrl + '/UpdateDivision', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  public copyDivision(divisionId) {
    return this.http.get(this.divisionsUrl + '/CopyDivision/?divisionID=' + divisionId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  public deleteDivision(divisionId) {
    return this.http.get(this.divisionsUrl + '/DeleteDivision/?divisionID=' + divisionId)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  /**
   * Zahteva od servera sve raspodele (divisions) koje pripadaju smeru
   * (department) ciji je ID prosledjen.
   * GET: api/Divisions/GetDivisions/{id}
   */
  public getDivisionsByType(departmentID: number): Promise<TypeDivisions[]> {
    return this.http.get(this.divisionsUrl + '/GetDivisionsOfDepartment/' + departmentID)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  /**
   * Vraca grupe studenata kada se svi studenti koji slusaju kurs podele na X grupa.
   */
  public getGroupsOnX(courseID: number, x: number, sortOrder: number) {
    return this.http.get(this.divisionsUrl + `/DivideOnX?courseID=${courseID}&x=${x}&sortOrder=${sortOrder}`)
      .toPromise().then(res => res.json()).catch(this.handleError);
  }

  /**
   * Vraca grupe studenata kada se svi studenti koji slusaju kurs podele tako da svaka grupa ima X studenata.
   */
  public getGroupsWithX(courseID: number, x: number, sortOrder: number) {
    return this.http.get(this.divisionsUrl + `/DivideWithX?courseID=${courseID}&x=${x}&sortOrder=${sortOrder}`)
      .toPromise().then(res => res.json()).catch(this.handleError);
  }

  public getAllDivisionTypes() {
    return this.http.get(this.divisionsUrl + '/GetAllDivisionTypes')
      .toPromise().then(res => res.json()).catch(this.handleError);
  }

  public createInitialDivision(name: string, departmentID: number,
                               courseID: number, divisionTypeID: number,
                               beginning: Date, ending: Date,
                               groups: Array<any>) {
    const body = JSON.stringify({
      name: name,
      departmentID: departmentID,
      courseID: courseID,
      divisionTypeID: divisionTypeID,
      beginning: beginning,
      ending: ending,
      groups: groups
    });
    /*debugger;*/
    console.log(body);
    const options = new RequestOptions({ headers: this.headers });
    return this.http.post(this.divisionsUrl + '/CreateInitialDivision', body, options)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}