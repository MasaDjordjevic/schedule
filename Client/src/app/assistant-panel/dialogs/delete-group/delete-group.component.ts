import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {ThemeService} from '../../../shared/theme.service';
import {TranslateService} from '@ngx-translate/core';
import {DivisionsService} from '../../../shared/services/divisions.service';
import {GroupsService} from '../../../shared/services/groups.service';
@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.scss']
})
export class DeleteGroupComponent implements OnInit {
  @Input() group: any;
  @HostBinding('class') themeClass = this.theme;

  constructor(public groupsService: GroupsService,
              public dialogRef: MdDialogRef<DeleteGroupComponent>,
              public snackBar: MdSnackBar,
              private themeService: ThemeService,
              private translate: TranslateService,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.group = data.group;
    console.log(this.group);
  }

  ngOnInit() {
  }

  get theme() {
    return this.themeService.getTheme() + '-theme';
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }


  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  removeGroup() {
    this.groupsService.removeGroup(this.group.GroupId)
      .then(response => {
        switch (response.status) {
          case 'success':
            this.openSnackBar(this.translate.instant('group_delete_successful__1') + ' ' +
              this.group.Name + ' ' +
              this.translate.instant('group_delete_successful__2'));
            this.close('deleted');
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('group_delete_unsuccessful__1') + ' ' +
              this.group.Name + ' ' +
              this.translate.instant('group_delete_unsuccessful__2'));
            debugger;
            break;
        }
      });
  }

}
