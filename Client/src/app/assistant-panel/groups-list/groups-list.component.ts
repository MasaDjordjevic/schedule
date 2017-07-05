import {Component, Input, OnInit} from '@angular/core';
import {GroupsService} from '../../shared/services/groups.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit {
  @Input() primaryColor = 'MaterialBlue';
  @Input() secondaryColor = 'MaterialOrange';

  private groups: any[];
  private errorMessage: string;

  // departmentId is there for setting route parameters later
  private selectedDepartmentId: number;
  private selectedDivisionId: number;
  private selectedGroupId: number;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private groupsService: GroupsService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.selectedDivisionId = +params['divisionId'];
        this.selectedDepartmentId = +params['departmentId'];
        const newGroupId = +params['groupId'];
        if (newGroupId !== this.selectedGroupId) {
          this.selectedGroupId = newGroupId;
          this.getGroups();
        }
      });
  }

  onSelect(groupId: number) {
    this.selectedGroupId = groupId;
    this.router.navigate(['/assistant', {
      departmentId: this.selectedDepartmentId,
      divisionId: this.selectedDivisionId,
      groupId: this.selectedGroupId
    }]);
  }

  getGroups() {
    if (!this.selectedDivisionId) {
      return;
    }
    this.groupsService.getGroups(this.selectedDivisionId)
      .then(
        groups => this.groups = groups,
        error => this.errorMessage = <any>error);
  }

}
