import { TestBed, inject } from '@angular/core/testing';

import { AssistantsService } from './assistants.service';

describe('AssistantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssistantsService]
    });
  });

  it('should be created', inject([AssistantsService], (service: AssistantsService) => {
    expect(service).toBeTruthy();
  }));
});
