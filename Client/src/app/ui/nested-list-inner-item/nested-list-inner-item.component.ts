import {Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-nested-list-inner-item',
  templateUrl: './nested-list-inner-item.component.html',
  styleUrls: ['./nested-list-inner-item.component.scss']
})
export class NestedListInnerItemComponent implements OnChanges {
  @Input() val: string;
  @Input() selected = false;
  @Input() primaryColor = 'MaterialBlue';
  @HostBinding('class') classString;

  constructor() { }

  ngOnChanges() {
    this.classString = this.primaryColor + (this.selected ? ' selected' : '');
  }

}
