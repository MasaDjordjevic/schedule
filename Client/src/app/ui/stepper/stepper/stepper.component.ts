import {
  AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnInit, Output,
  QueryList
} from '@angular/core';
import {StepComponent} from '../step/step.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, AfterContentInit {
  @Input() theme: string;
  private _currentStep = 1;
  @Output() onSubmit = new EventEmitter();
  @ContentChildren(StepComponent) _steps: QueryList<StepComponent>;

  constructor() { }

  public submit = () => {this.onSubmit.emit('submit'); };

  set currentStep(n: number) {
    this._currentStep = n;
    this._notifySteps();
  }

  get currentStep() {
    return this._currentStep;
  }

  public get totalSteps() {
    return this._steps.toArray().length;
  }

  ngAfterContentInit() {
    this._notifySteps();
  }

  // Obavesti dete tako da zna da je on trenutni (da se prikaže).
  private _notifySteps() {
    for (let i = 0; i < this._steps.toArray().length; i++) {
      // console.log(i, this.currentStep);
      this._steps.toArray()[i].isCurrent = (this.currentStep === i + 1);
    }
  }

  // vraca niz objekata koji imaju stepTitle i trenutnu vrednost validnosti podataka.
  get stepsArray(): Array<any> {
    const _stepsArray = this._steps.toArray();
    const ret: Array<any> = new Array<string>(_stepsArray.length);
    for (let i = 0; i < _stepsArray.length; i++) {
      ret[i] = {
        stepTitle: _stepsArray[i].stepTitle,
        valid: _stepsArray[i].valid,
      };
    }
    return ret;
  }

  public get stepTitles(): Array<string> {
    return this.stepsArray.map(i => i.stepTitle);
  }

  public get stepValids(): Array<boolean> {
    return this.stepsArray.map(i => i.valid);
  }

  goToNext() {
    if (!this.currentIsLast()) {
      this.currentStep++;
    }
  }

  goToPrev() {
    if (!this.currentIsFirst()) {
      this.currentStep--;
    }
  }

  finish() {
    alert('Done!');
  }

  public currentIsFirst = () => this.currentStep === 1;
  public currentIsLast = () => this.currentStep === this.totalSteps;
  public currentIsValid = () => this.stepValids[this.currentStep - 1];
  public allAreValid = () => !!this.stepValids.reduce((p, c) => p && c);

  ngOnInit() {
  }

}
