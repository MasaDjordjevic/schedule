import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginMessage = '';

  public username = '';
  public password = '';

  constructor(private loginService: LoginService,
              private router: Router) {
    this.loginService.loginRedirect()
      .then(res => {
        if (res.status === 'redirect') {
          this.router.navigate(['/' + res.url]);
        }
      });
  }

  ngOnInit() {
  }

  login() {
    this.loginMessage = '';
    this.loginService.login(this.username, this.password)
      .then(res => {
        if (res.status === 'success') {
          this.router.navigate(['/' + res.url]);
        } else if (res.exception === 'Wrong credentials') {
          this.loginMessage = res.exception;
        }
      });
  }

  check() {
    this.loginService.getUserInfo();
    this.loginService.getUserInfo2();
    this.loginService.probaPost();
  }

  removeLoginMessage() {
    this.loginMessage = '';
  }

}
