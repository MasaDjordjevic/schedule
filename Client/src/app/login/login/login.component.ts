import { Component, OnInit } from '@angular/core';
import {LoginService} from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private loginMessage: string = "";
  private showLoginMessage: boolean =false;

  public username: string = "";
  public password: string = "";

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  login() {
    this.loginService.login(this.username, this.password)
      .then(res => console.log(res));
  }

}
