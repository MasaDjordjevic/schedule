import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-nested-list',
  templateUrl: './nested-list.component.html',
  styleUrls: ['./nested-list.component.scss'],
})
export class NestedListComponent implements OnInit {
  @Input() title: string;

  @Input() secondaryColor = 'MaterialOrange';

  @HostBinding('class')  @Input() primaryColor = 'MaterialBlue';

  public visible = false;

  constructor() { }

  ngOnInit() {
  }

}
