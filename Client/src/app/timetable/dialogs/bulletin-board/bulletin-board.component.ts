import {Component, Inject, Input, OnInit} from '@angular/core';
import {GroupsService} from '../../../shared/services/groups.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-bulletin-board',
  templateUrl: './bulletin-board.component.html',
  styleUrls: ['./bulletin-board.component.scss']
})
export class BulletinBoardComponent implements OnInit {

  possibleChoices: any[] = <any>[]; // kad bira
  chosenPossibleChoice: any; // sta je izabrao kad bira
  allChoices: { groupId: number, time: string }[] = <any>[]; // kad dodaje novi
  chosenAllChoices: any[] = <any>[]; // sta je izabrao kad dodaje novi


  private _groupId: number;
  @Input() set groupId(id) {
    this._groupId = id;
    this.getPossibleChoices();
    this.getAllChoices();
  }

  get groupId() {
    return this._groupId;
  }

  constructor(private groupsService: GroupsService,
              public snackBar: MdSnackBar,
              private translate: TranslateService,
              public dialogRef: MdDialogRef<BulletinBoardComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.groupId = data.groupId;
  }

  private clearAll() {
    this.possibleChoices = <any>[];
    this.allChoices = <any>[];
    this.chosenAllChoices = null;
    this.chosenPossibleChoice = null;
  }

  ngOnInit() {
  }

  private getPossibleChoices(): void {
    this.groupsService.getPossibleBulletinBoardChoices(this.groupId)
      .then(result => {
        this.possibleChoices = <any>result;
        console.log(this.possibleChoices);
      });
  }

  private getAllChoices(): void {
    this.groupsService.getAllBulletinBoardChoices(this.groupId)
      .then(result => {
        this.allChoices = <any>result;
        this.chosenAllChoices = this.allChoices.filter(i => i['chosen']).map(i => i.groupId);
      });
  }


  allChoicesItemChange(data) {
    this.chosenAllChoices = _.xor([data], this.chosenAllChoices);
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }

  public exchangeWith() {
    this.groupsService.exchangeStudents(this.groupId, this.chosenPossibleChoice)
      .then(response => {
        switch (response['status']) {
          case 'success':
            this.openSnackBar(this.translate.instant('exchange_successful'));
            this.close('refresh');
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('exchange_not_successful'));
            break;
        }
      });
  }

  addAd(): void {
    this.groupsService.addAd(this.groupId, this.chosenAllChoices)
      .then(result => {
        switch (result.status) {
          case 'success':
            this.openSnackBar(this.translate.instant('adding_ad_successful'));
            this.close('refresh');
            break;
          default:
            this.openSnackBar(this.translate.instant('error') + ' ' +
              this.translate.instant('adding_ad_unsuccessful'));
            debugger;
            break;
        }
      });
  }
}
