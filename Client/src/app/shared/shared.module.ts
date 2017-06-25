import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {
  MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdMenuModule, MdIconModule,
  MdDialogModule, MdAutocompleteModule, MdDatepickerModule, MdNativeDateModule, MdTooltipModule, MdSnackBar,
  MdSnackBarModule
} from '@angular/material';


@NgModule({
  exports: [
    TranslateModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdSelectModule,
    MdMenuModule,
    MdIconModule,
    MdDialogModule,
    MdAutocompleteModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdTooltipModule,
    MdSnackBarModule,
  ]
})
export class SharedModule {
}
