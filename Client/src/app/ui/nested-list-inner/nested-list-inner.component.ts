import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-nested-list-inner',
  templateUrl: './nested-list-inner.component.html',
  styleUrls: ['./nested-list-inner.component.scss']
})
export class NestedListInnerComponent implements OnInit {
  @Input() title: string;

  public visible = true;

  public toggle() {
    this.visible = !this.visible;
  }
  constructor() { }

  ngOnInit() {
  }

}
