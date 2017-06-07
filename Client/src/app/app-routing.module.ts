import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {TestComponent} from './test/test.component';
import {EmptyComponent} from './test/empty/empty.component';
import {LoginComponent} from './login/login/login.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'test', loadChildren: 'app/test/test.module#TestModule'
  },
  {
    path: 'login', component: LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
