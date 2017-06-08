import { NgModule } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {MdButtonModule, MdCheckboxModule} from '@angular/material';


@NgModule({
  exports: [
    TranslateModule,
    MdButtonModule,
    MdCheckboxModule
  ]
})
export class SharedModule { }
