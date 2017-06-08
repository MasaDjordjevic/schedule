import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {
  isDarkTheme: boolean = false;
  private theme: string = 'default';
  constructor() { }

  ngOnInit() {
  }

  onRaisedButtonClick(){
    console.log('raised clicked');
  }

  changeTheme(){
    this.isDarkTheme = !this.isDarkTheme;
    this.theme = this.isDarkTheme ? 'dark' : 'default';

  }
}
