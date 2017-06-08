import { NgModule } from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {MdButtonModule, MdCheckboxModule, MdInputModule} from '@angular/material';


@NgModule({
  exports: [
    TranslateModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule
  ]
})
export class SharedModule { }
