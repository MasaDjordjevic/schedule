import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {
  MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdMenuModule, MdIconModule,
  MdDialogModule, MdAutocompleteModule, MdDatepickerModule, MdNativeDateModule, MdTooltipModule, MdSnackBar,
  MdSnackBarModule
} from '@angular/material';
import {ThemeService} from './theme.service';


@NgModule({
  providers: [ThemeService],
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
