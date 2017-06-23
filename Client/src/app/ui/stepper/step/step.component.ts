import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  @HostBinding('class.show') isCurrent = false;

  @Input() public valid = true; // ako se nista ne prosledi, true je da bi uopste moglo da se navigira
  @Input() public stepTitle = 'Još uvek bez dobrog naslova';

  constructor() { }

  ngOnInit() {
  }

}
