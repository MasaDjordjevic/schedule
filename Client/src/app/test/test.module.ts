import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import {TestComponent} from './test.component';
import { EmptyComponent } from './empty/empty.component';
import { ClassroomsComponent } from './classrooms/classrooms.component';
import {ClassroomsService} from './classrooms/classrooms.service';

@NgModule({
  imports: [
    CommonModule,
    TestRoutingModule
  ],
  declarations: [TestComponent, EmptyComponent, ClassroomsComponent],
  providers: [ClassroomsService]
})
export class TestModule { }
