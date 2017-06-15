import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-nested-list-inner-item',
  templateUrl: './nested-list-inner-item.component.html',
  styleUrls: ['./nested-list-inner-item.component.scss']
})
export class NestedListInnerItemComponent implements OnInit {
  @Input() val: string;
  @Input() selected = false;
  @Input() primaryColor = 'MaterialBlue';
  @HostBinding('class') classString;

  constructor() { }

  ngOnInit() {
    this.classString = this.primaryColor + (this.selected ? ' selected' : '');
  }

}
