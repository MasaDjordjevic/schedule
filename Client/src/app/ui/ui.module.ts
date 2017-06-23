import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NestedListComponent} from './nested-list/nested-list.component';
import {NestedListInnerComponent} from './nested-list-inner/nested-list-inner.component';
import {NestedListInnerItemComponent} from './nested-list-inner-item/nested-list-inner-item.component';
import {SDlComponent} from './s-dl/s-dl.component';
import {StepComponent} from './stepper/step/step.component';
import {StepperHeaderComponent} from './stepper/stepper-header/stepper-header.component';
import {StepperComponent} from './stepper/stepper/stepper.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [NestedListComponent, NestedListInnerComponent, NestedListInnerItemComponent,
    SDlComponent, StepComponent, StepperHeaderComponent, StepperComponent],
  exports: [NestedListComponent, NestedListInnerComponent, NestedListInnerItemComponent, SDlComponent, StepperComponent, StepComponent]
})
export class UiModule {
}
