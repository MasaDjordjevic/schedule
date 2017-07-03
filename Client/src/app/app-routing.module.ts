import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {TestComponent} from './test/test.component';
import {EmptyComponent} from './test/empty/empty.component';
import {LoginComponent} from './login/login/login.component';
import {UiComponent} from './test/ui/ui.component';
import {StudentPanelComponent} from './student-panel/student-panel/student-panel.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/student', pathMatch: 'full'
  },
  {
    path: 'test', loadChildren: 'app/test/test.module#TestModule'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'ui', component: UiComponent
  },
  {
    path: 'assistant', loadChildren: 'app/assistant-panel/assistant-panel.module#AssistantPanelModule'
  },
  {
    path: 'student', loadChildren: 'app/student-panel/student-panel.module#StudentPanelModule'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
