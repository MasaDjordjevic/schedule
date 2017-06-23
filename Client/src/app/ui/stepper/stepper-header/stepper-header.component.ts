import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stepper-header',
  templateUrl: './stepper-header.component.html',
  styleUrls: ['./stepper-header.component.scss']
})
export class StepperHeaderComponent implements OnInit {

  @Input() stepValids: Array<boolean>;
  @Input() stepTitles: Array<string>;
  @Input() currentStep = 1;

  constructor() {
  }

  public isPast = step => step + 1 < this.currentStep;
  public isCurrent = step => step + 1 === this.currentStep;
  public isFuture = step => step + 1 > this.currentStep;
  public isValid = step => this.stepValids[step];

  public markAsDone = step => this.isPast(step) && this.isValid(step);
  public markAsError = step => this.isPast(step) && !this.isValid(step);

  ngOnInit() {
  }

}
