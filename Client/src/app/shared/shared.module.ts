import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdMenuModule, MdIconModule} from '@angular/material';


@NgModule({
  exports: [
    TranslateModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdSelectModule,
    MdMenuModule,
    MdIconModule
  ]
})
export class SharedModule {
}
