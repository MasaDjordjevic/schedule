import {Component, OnInit, Inject, HostBinding} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import {DivisionCreatorComponent} from '../division-creator/division-creator.component';
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-export-division',
  templateUrl: './export-division.component.html',
  styleUrls: ['./export-division.component.scss']
})
export class ExportDivisionComponent implements OnInit {
  division: any;
  csv: string;

  @HostBinding('class') themeClass = this.theme;

  constructor(private translate: TranslateService,
              private themeService: ThemeService,
              public snackBar: MdSnackBar,
              public dialogRef: MdDialogRef<DivisionCreatorComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.division = data.division;
    this.generateCSV();
  }

  ngOnInit() {
  }

  get theme() {
    return this.themeService.getTheme() + '-theme';
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {duration: 2000});
  }

  public generateCSV() {
    var s = "";
    for (let i = 0; i < this.division.Groups.length; i++) {
      s += `${this.division.Groups[i].Name}\n`;
      s += `Vreme\t${this.division.Groups[i].TimeSpanId}\n`;
      s += `Mesto\t${this.division.Groups[i].Classroom && this.division.Groups[i].Classroom.Number}\n\n`;
      s += 'Indeks\tIme\tPrezime\n';
      for (let j = 0; j < this.division.Groups[i].GroupsStudents.length; j++) {
        s += `${this.division.Groups[i].GroupsStudents[j].Student.IndexNumber}\t`;
        s += `${this.division.Groups[i].GroupsStudents[j].Student.UniMembers.Name}\t`
        s += `${this.division.Groups[i].GroupsStudents[j].Student.UniMembers.Surname}\n`;
      }
      s += '\n\n\n';

      this.csv = s;
    }
  }

  copyToClipboard(el: HTMLTextAreaElement) {
    try {
      el.select();
      document.execCommand("copy");
      this.openSnackBar(this.translate.instant('copy_successful'));
    } catch (err) {
      this.openSnackBar(this.translate.instant('copy_successful'));
    } finally {
      // deselect
      el.selectionStart = 0;
      el.selectionEnd = 0;
    }
  }
}
