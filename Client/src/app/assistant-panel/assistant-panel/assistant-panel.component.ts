import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-assistant-panel',
  templateUrl: './assistant-panel.component.html',
  styleUrls: ['./assistant-panel.component.scss']
})
export class AssistantPanelComponent implements OnInit {
  selectedDepartmentId: number;
  selectedDivisionId: number;
  selectedGroupId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
          this.selectedDepartmentId = +params['departmentId'];
          this.selectedDivisionId = +params['divisionId'];
          this.selectedGroupId = +params['groupId'];
          console.log(this.selectedDepartmentId);
          console.log(this.selectedDivisionId);
          console.log(this.selectedGroupId);
      });
  }

}
