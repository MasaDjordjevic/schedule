import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from '../../shared/services/cookie.service';

@Component({
  selector: 'app-unauthorized-access',
  templateUrl: './unauthorized-access.component.html',
  styleUrls: ['./unauthorized-access.component.scss']
})
export class UnauthorizedAccessComponent implements OnInit {

  constructor(private translate: TranslateService,
              private cookieService: CookieService) {
    translate.setDefaultLang(this.cookieService.getLanguage());
  }

  ngOnInit() {
  }

}
