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
        if(res.status === 'success') {
          console.log('sucess');
        } else {
          this.loginMessage = res.exception;
        }
      });
  }

}
