import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class RefreshTimetableService {
  public refresh$ = new Subject<void>();

  constructor() { }

  refresh() {
    this.refresh$.next();
  }



}
