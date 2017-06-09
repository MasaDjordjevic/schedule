import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NestedListComponent } from './nested-list/nested-list.component';
import { NestedListInnerComponent } from './nested-list-inner/nested-list-inner.component';
import { NestedListInnerItemComponent } from './nested-list-inner-item/nested-list-inner-item.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NestedListComponent, NestedListInnerComponent, NestedListInnerItemComponent],
  exports: [NestedListComponent, NestedListInnerComponent, NestedListInnerItemComponent]
})
export class UiModule { }
