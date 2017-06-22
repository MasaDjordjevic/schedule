import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestComponent} from './test.component';
import {EmptyComponent} from './empty/empty.component';
import {ClassroomsComponent} from './classrooms/classrooms.component';

const routes: Routes = [
  // {
  //   path: '', component: EmptyComponent
  // },
  {
    path: 'simpleTest', component: TestComponent
  },
  {
    path: 'classrooms', component: ClassroomsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
