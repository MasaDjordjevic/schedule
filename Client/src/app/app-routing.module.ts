import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {TestComponent} from './test/test.component';
import {EmptyComponent} from './test/empty/empty.component';
import {LoginComponent} from './login/login/login.component';
import {UiComponent} from './test/ui/ui.component';
import {StudentPanelComponent} from './student-panel/student-panel/student-panel.component';
import {AuthGuardService} from './login/auth-guard.service';
import {UnauthorizedAccessComponent} from './errors/unauthorized-access/unauthorized-access.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
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
    path: 'assistant',
    canLoad: [AuthGuardService],
    loadChildren: 'app/assistant-panel/assistant-panel.module#AssistantPanelModule'
  },
  {
    path: 'student',
    canLoad: [AuthGuardService],
    loadChildren: 'app/student-panel/student-panel.module#StudentPanelModule'
  },
  {
    path: 'unauthorized',
    component: UnauthorizedAccessComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
