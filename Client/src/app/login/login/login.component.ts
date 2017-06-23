import { Component, OnInit } from '@angular/core';
import {LoginService} from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private loginMessage = '';

  public username = '';
  public password = '';

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  login() {
    this.loginMessage = '';
    this.loginService.login(this.username, this.password)
      .then(res => {
        console.log(res);
        // if (res.status === 'success') {
        //   console.log('sucess');
        //   console.log(res.data);
        // } else {
        //   this.loginMessage = res.exception;
        // }
      });
  }

  check() {
    this.loginService.getUserInfo();
    this.loginService.getUserInfo2();
  }

}
