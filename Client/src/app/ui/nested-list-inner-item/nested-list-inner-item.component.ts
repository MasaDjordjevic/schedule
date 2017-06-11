import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-nested-list-inner-item',
  templateUrl: './nested-list-inner-item.component.html',
  styleUrls: ['./nested-list-inner-item.component.scss']
})
export class NestedListInnerItemComponent implements OnInit {
  @Input() val: string;
  @HostBinding('class')  @Input() primaryColor = 'MaterialBlue';

  @Output() select: EventEmitter<any> = new EventEmitter();


  public onClick() {
    this.select.emit({
      val: this.val,
    });
  }

  constructor() { }

  ngOnInit() {
  }

}
