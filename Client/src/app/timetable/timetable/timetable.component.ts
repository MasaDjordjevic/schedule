import {Component, Input, OnInit} from '@angular/core';
import {TimetableType} from '../../shared/timetable-type.enum';
import {Mode} from '../mode.enum';
import {StudentsService} from '../../shared/services/students.service';
import {GroupsService} from '../../shared/services/groups.service';
import {ClassroomsService} from '../../shared/services/classrooms.service';
import {DepartmentsService} from '../../shared/services/departments.service';
import {AssistantsService} from '../../shared/services/assistants.service';
import {TranslateService} from '@ngx-translate/core';
import {ToTimestampPipe} from '../to-timestamp.pipe';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  beginningMinutes = 480; // npr. 07:00 je 420
  endingMinutes = 1200; // npr. 20:00 je 1200
  showEvery = 15; // npr. prikǎzi liniju na svakih 15 minuta
  scale = 2.2; // koliko piksela je jedan minut

  errorMessage: string;
  classes: any[];

  _weeksFromNow = 0;
  _groupId: number;
  _studentId: number;
  _officialStudentId: number;
  _departmentId: number;
  _classroomId: number;
  _assistantId: number;

  public _dayNames: string[] = [
    this.translate.instant('monday'),
    this.translate.instant('tuesday'),
    this.translate.instant('wednesday'),
    this.translate.instant('thursday'),
    this.translate.instant('friday'),
    this.translate.instant('saturday'),
    this.translate.instant('sunday'),
  ];
  displayDay: Array<boolean> = [true, true, true, true, true, true, false];

  @Input() type: TimetableType;

  clearAll() {
    this._groupId = this._studentId = this._officialStudentId =
      this._departmentId = this._classroomId = this._assistantId = null;
  }

  get mode() {
    if (this.type === TimetableType.Official && this.officialStudentId) {
      return Mode.StudentOfficial;
    } else if (this.type === TimetableType.Global && this.departmentId) {
      return Mode.StudentGlobal;
    } else if (this.type === TimetableType.Personal && this.studentId) {
      return Mode.StudentPersonal;
    } else if (this.classroomId) {
      return Mode.ClassroomOfficial;
    } else if (this.assistantId) {
      return Mode.AssistantOfficial;
    } else {
      return Mode.StudentOfficial; // default
    }
  }

  get weeksFromNow() {
    return this._weeksFromNow;
  }

  @Input() set weeksFromNow(w) {
    this._weeksFromNow = w;
    this.getSchedule();
  }

  getSchedule() {
    if (this.studentId) {
      this.getStudentSchedule();
    } else if (this.classroomId) {
      this.getClassroomSchedule();
    } else if (this.groupId) {
      this.getGroupSchedule();
    } else if (this.departmentId) {
      this.getDepartmentSchedule();
    } else if (this.officialStudentId) {
      this.getOfficialStudentSchedule();
    } else if (this.assistantId) {
      this.getAssistantSchedule();
    } else {
      debugger;
      throw new Error('nesto ne valja');
    }
  }

  get groupId() {
    return this._groupId;
  }

  @Input() set groupId(g) {
    if (!g) {
      return;
    }
    this.clearAll();
    this._groupId = g;
    this.getGroupSchedule();
  }

  get studentId() {
    return this._studentId;
  }

  @Input() set studentId(s) {
    if (!s) {
      return;
    }
    this.clearAll();
    this._studentId = s;
    this.getStudentSchedule();
  }

  get officialStudentId() {
    return this._officialStudentId;
  }

  @Input() set officialStudentId(id) {
    if (!id) {
      return;
    }
    this.clearAll();
    this._officialStudentId = id;
    this.getOfficialStudentSchedule();
  }

  get departmentId() {
    return this._departmentId;
  }

  @Input() set departmentId(g) {
    if (!g) {
      return;
    }
    this.clearAll();
    this._departmentId = g;
    this.getDepartmentSchedule();
  }

  get classroomId() {
    return this._classroomId;
  }

  @Input() set classroomId(g) {
    if (!g) {
      return;
    }
    this.clearAll();
    this._classroomId = g;
    this.getClassroomSchedule();
  }

  get assistantId() {
    return this._assistantId;
  }

  @Input() set assistantId(a) {
    if (!a) {
      return;
    }
    this.clearAll();
    this._assistantId = a;
    this.getAssistantSchedule();
  }

  get timeStamps(): Array<string> {
    const ret = [];
    const toTimestampPipe = new ToTimestampPipe();
    // Da ne udje u beskonacnu petlju
    if (this.showEvery === 0) {
      return ret;
    }
    for (let min = this.beginningMinutes; min <= this.endingMinutes; min += this.showEvery) {
      ret.push(toTimestampPipe.transform(min));
    }
    return ret;
  };

  constructor(private studentsService: StudentsService,
              private groupsService: GroupsService,
              private departmentsService: DepartmentsService,
              private clasroomsService: ClassroomsService,
              private assistantService: AssistantsService,
              private translate: TranslateService) {

  }

  getStudentSchedule() {
    this.studentsService.getPersonalSchedule(this.studentId, this.weeksFromNow)
      .then(
        sch => this.classes = sch,
        error => this.errorMessage = error);
  }

  getOfficialStudentSchedule() {
    this.studentsService.getOfficialSchedule(this.officialStudentId, this.weeksFromNow)
      .then(
        sch => this.classes = sch,
        error => this.errorMessage = error);
  }

  getGroupSchedule() {
    this.groupsService.getSchedule(this.groupId, this.weeksFromNow)
      .then(
        sch => this.classes = sch,
        error => this.errorMessage = error);
  }

  getDepartmentSchedule() {
    this.departmentsService.getSchedule(this.departmentId, this.weeksFromNow)
      .then(
        sch => this.classes = sch,
        error => this.errorMessage = error);
  }

  getClassroomSchedule() {
    this.clasroomsService.getSchedule(this.classroomId, this.weeksFromNow)
      .then(
        sch => this.classes = sch,
        error => this.errorMessage = error);
  }

  getAssistantSchedule() {
    this.assistantService.getSchedule(this.assistantId, this.weeksFromNow)
      .then(
        sch => this.classes = sch,
        error => this.errorMessage = error);
  }

  ngOnInit() {
  }


  // U studetskom panelu se ce biti overridovano opcijama iz samog panela,
  // ovde mu postavljam getter samo da kod asistentskog panela ne bi puklo.
  // Zapravo moze uvek da bude ovako.
  @Input()
  public set dayNames(dayNames) {
    this._dayNames = dayNames;
  }

  public get dayNames() {
    return this._dayNames;
  }

  public get dayNamesAbbr(): string[] {
    const length = 3;
    return this.dayNames.map(dayName => dayName.substr(0, length));
  }


}
