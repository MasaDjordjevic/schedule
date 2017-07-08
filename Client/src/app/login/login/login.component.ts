import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private loginMessage = '';

  public username = 'plavusha';
  public password = 'plavusha';

  constructor(private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.loginMessage = '';
    this.loginService.login(this.username, this.password)
      .then(res => {
        if (res.status === 'success') {
          this.router.navigate(['/' + res.url]);
        }
      });
  }

  check() {
    this.loginService.getUserInfo();
    this.loginService.getUserInfo2();
    this.loginService.probaPost();
  }

}
