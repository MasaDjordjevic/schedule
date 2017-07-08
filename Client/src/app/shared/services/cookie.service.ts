import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {

  constructor() { }

  getCookie(cookies: any, key: string) {
    const k = cookies.filter(el => el[0] === key);
    if (k.length > 0) {
      return k[0][1];
    } else {
      return '';
    }
  }
  public getLanguage() {
    if (document.cookie) {
      const cookies = document.cookie.split('; ').map(el => el.split('='));
      return this.getCookie(cookies, 'language');
    } else {
      return 'en';
    }
  }
}
