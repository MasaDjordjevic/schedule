import { TestBed, inject } from '@angular/core/testing';

import { RefreshTimetableService } from './refresh-timetable.service';

describe('RefreshTimetableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefreshTimetableService]
    });
  });

  it('should be created', inject([RefreshTimetableService], (service: RefreshTimetableService) => {
    expect(service).toBeTruthy();
  }));
});
