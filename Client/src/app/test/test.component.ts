import {Component} from '@angular/core';
@Component({
  template: `
    <h1>{{"test" | translate}}</h1>
    
    <router-outlet></router-outlet>
  `
})
export class TestComponent {
}
