import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AuthService} from '../../login/auth.service';
import {AppSettings} from '../AppSettings';

@Injectable()
export class AssistantsService {
  private assistantsUrl = AppSettings.API_ENDPOINT + '/api/Assistants';  // URL to web api

  constructor(private http: Http,
              private authService: AuthService) { }


  getAssistant(assistantId: number): Promise<any> {
    return this.authService.authGet(this.assistantsUrl + '/GetAssistant/' + assistantId);
  }

  getAssistants(): Promise<any[]> {
    return this.authService.authGet(this.assistantsUrl + '/GetAssistants');
  }

  // vraca sve asistente ako raspodela kojoj pripada grupa nije kreirana po kursu ili vraca sve asistente tog kursa
  getAssistantsByGroupID(groupId: number): Promise<any[]> {
    return this.authService.authGet(this.assistantsUrl + '/GetAssistantsByGroupID/' + groupId);
  }

  getSchedule(assistantId: number, weeksFromNow: number): Promise<any[]> {
    return this.authService.authGet(this.assistantsUrl + `/GetSchedule/?assistantID=${assistantId}&weeksFromNow=${weeksFromNow}`);
  }
}
