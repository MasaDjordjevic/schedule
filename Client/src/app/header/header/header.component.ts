import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

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

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'fr', 'sr']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
  }

  changeLang(lang: string) {
    console.log(lang);
    this.translate.use(lang);
  }

}
