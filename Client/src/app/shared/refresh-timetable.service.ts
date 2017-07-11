import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class RefreshTimetableService {
  public refresh$ = new Subject<void>();
  public settings$ = new Subject<object>();

  constructor() { }

  refresh() {
    this.refresh$.next();
  }

  settings(obj) {
    this.settings$.next(obj);
  }



}
