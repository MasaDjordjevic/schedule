import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ThemeService} from '../../shared/theme.service';
import {LoginService} from '../../login/login.service';

@Component({
  selector: 'app-assistant-panel',
  templateUrl: './assistant-panel.component.html',
  styleUrls: ['./assistant-panel.component.scss']
})
export class AssistantPanelComponent implements OnInit {
  selectedDepartmentId: number;
  selectedDivisionId: number;
  selectedGroupId: number;
  selectedStudentId: number;

  assistant: any;
  error: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private themeService: ThemeService,
              private loginService: LoginService) {
    this.getAssistant();
  }

  get isSomethingSelected() {
    return this.selectedDivisionId || this.selectedStudentId || this.selectedGroupId || this.selectedDepartmentId;
  }

  get theme() {
    return this.themeService.getTheme() + '-theme';
  }

  getThemeClass(type: string): string {
    switch (type) {
      case 'department':
        return this.themeService.getTheme() + '-primary';
      case 'division':
        return this.themeService.getTheme() + '-accent';
      case 'group':
        return this.themeService.getTheme() + '-warn';
      case 'student':
        return this.themeService.getTheme() + '-accent2';
    }
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.selectedDepartmentId = +params['departmentId'];
        this.selectedDivisionId = +params['divisionId'];
        this.selectedGroupId = +params['groupId'];
        this.selectedStudentId = +params['studentId'];
        // console.log(this.selectedDepartmentId);
        // console.log(this.selectedDivisionId);
        // console.log(this.selectedGroupId);
        // console.log(this.selectedStudentId);
      });
  }

  getAssistant() {
    this.loginService.getUser()
      .then(
        asst => this.assistant = asst,
        error => this.error = error).then(() => console.log(this.assistant));
  }

}
