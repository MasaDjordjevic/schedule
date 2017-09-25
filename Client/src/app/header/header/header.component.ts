import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../shared/theme.service';
import {Router} from '@angular/router';
import {LoginService} from '../../login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() name: string;
  @Input() surname: string;
  @Input() address: string;
  @Input() email: string;
  @Input() avatarUrl: string;
  private cookies;
  private currentLanguage: string;
  private currentTheme: string;


  constructor(private translate: TranslateService,
              public router: Router,
              private loginService: LoginService,
              private theme: ThemeService) {
    translate.addLangs(['en', 'fr', 'sr']);
    translate.setDefaultLang('en');
  }

  getCookie(key: string) {
    const k = this.cookies.filter(el => el[0] === key);
    if (k.length > 0) {
      return k[0][1];
    } else {
      return '';
    }
  }

  setCookie() {
    document.cookie = `language=${this.currentLanguage}`;
    document.cookie = `theme=${this.currentTheme}`;
  }


  ngOnInit() {
    if (document.cookie) {
      this.cookies = document.cookie.split('; ').map(el => el.split('='));
      console.log(document.cookie);
      this.currentLanguage = this.getCookie('language');
      this.currentTheme = this.getCookie('theme');
    } else {
      this.currentLanguage = 'en'; // default language
      this.currentTheme = this.theme.allThemes[0]; // default theme
    }
    this.translate.use(this.currentLanguage);
    this.theme.setTheme(this.currentTheme);
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.currentLanguage = lang;
    this.setCookie();
  }

  changeTheme(theme: string) {
    this.theme.setTheme(theme);
    this.currentTheme = theme;
    this.setCookie();
  }

  logout() {
    this.loginService.logout()
      .then(() => this.router.navigate(['/login']));
  }
}
