import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-nested-list',
  templateUrl: './nested-list.component.html',
  styleUrls: ['./nested-list.component.scss']
})
export class NestedListComponent implements OnInit {
  @Input() title: string;
  @Input() primaryColor = 'MaterialBlue';
  @Input() secondaryColor = 'MaterialOrange';


  public visible = false;

  constructor() { }

  ngOnInit() {
  }

}
