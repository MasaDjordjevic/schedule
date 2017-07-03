import {AfterViewInit, Component, Inject, Input, OnInit} from '@angular/core';
import {Course} from '../../../models/Course';
import {Student} from '../../../models/Student';
import {DivisionType} from '../../../models/DivisionType';
import {DivisionsService} from '../../services/divisions.service';
import {CoursesService} from '../../services/courses.service';
import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar} from '@angular/material';
import preventExtensions = Reflect.preventExtensions;
import {TranslateService} from '@ngx-translate/core';
import {ThemeService} from '../../../shared/theme.service';

@Component({
  selector: 'app-division-creator',
  templateUrl: './division-creator.component.html',
  styleUrls: ['./division-creator.component.scss']
})
export class DivisionCreatorComponent implements AfterViewInit {



  // region Podaci o novoj raspodeli koja se kreira
  public newDivisionName: string;
  public newDivisionCourseId: string;
  public newDivisionEndingDate: string;
  public newDivisionBeginningDate: string;
  public newDivisionTypeId: string;

  public newDivisionCreationWay: 'on_x' | 'with_x' | 'manual';
  public newDivisionCreationNumberX: string;
  public newDivisionCreationOrderIsRandom: '0' | '1';

  public newDivisionClassName = (id = this.newDivisionCourseId) =>
    this.courses.filter(i => i.CourseId === +id)[0].Name;
  public newDivisionBeginningDateToDate = () => new Date(this.newDivisionBeginningDate);
  public newDivisionEndingDateToDate = () => new Date(this.newDivisionEndingDate);
  public newDivisionTypeName = (id = this.newDivisionTypeId) =>
    (<any>this.divisionTypes).filter(i => i.divisionTypeId === id)[0].type;
  public newDivisionCreationOrderName = (i = this.newDivisionCreationOrderIsRandom) =>
    i === '0' ? this.translate.instant('by_index_number') : this.translate.instant('random');


  // endregion

  // region Validacije, read-only
  public get $$newDivisionName(): boolean {
    let ret: boolean = !!this.newDivisionName; // da ne bude null
    ret = ret && !!this.newDivisionName.trim().match(/.+/); // da ima bar jedno... nesto
    // stavio bih ja \w da bude alfanumericki znak ali onda ne gadja šđčćž, sto i nije problem jer sumnjam
    // da bi se raspodela (division) zvala iskljucivo od slova sa kvacicama, ali ajde neka ga ovako. ovako
    // moze da se zove sa tackom. moze i da bude srculence. mora probamo.
    return ret;
  }

  public get $$newDivisionClassId(): boolean {
    return true;
  }

  public get $$newDivisionTypeId(): boolean {
    return true;
  }

  public get $$newDivisionBeginningDate(): boolean {
    let ret: boolean = !!this.newDivisionBeginningDate;
    // godina mora 4, ostalo 1 ili 2. dozvoljava -, . ili / kao odvajanje izmedju brojki
    ret = ret && !!this.newDivisionBeginningDate.match(/\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}/);
    // mora da bude validan datum, da ne bude trinesti mesc ili 30. febuar
    ret = ret && new Date(this.newDivisionBeginningDate).toString() !== 'Invalid Date';
    return !!ret;
  }

  public get $$newDivisionEndingDate(): boolean {
    let ret: boolean = !!this.newDivisionEndingDate;
    // godina mora 4, ostalo 1 ili 2. dozvoljava -, . ili / kao odvajanje izmedju brojki
    ret = ret && !!this.newDivisionEndingDate.match(/\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}/);
    // mora da bude validan datum, da ne bude trinesti mesc ili 30. febuar
    ret = ret && new Date(this.newDivisionEndingDate).toString() !== 'Invalid Date';
    return !!ret;
  }

  public get $$newDivisionCreationWay(): boolean {
    return this.newDivisionCreationWay !== null;
  }

  public get $$newDivisionCreationNumberX(): boolean {
    let ret: boolean = !!this.newDivisionCreationNumberX;
    ret = this.newDivisionCreationWay === 'manual' || (ret && !!this.newDivisionCreationNumberX.match(/^\d+$/)); // integer
    return ret;
  }

  public get $$newDivisionCreationOrderIsRandom(): boolean {
    return this.newDivisionCreationOrderIsRandom !== null || this.newDivisionCreationWay === 'manual';
  }

  // 0 se misli da je sve validno, zajedno
  // 1 - n su koraci od 1 do n
  // sve ostalo vraca false
  public isValid(i: number = 0) {

    switch (i) {
      case 1:
        return !!(this.$$newDivisionName &&
        this.$$newDivisionClassId &&
        this.$$newDivisionTypeId &&
        this.$$newDivisionBeginningDate &&
        this.$$newDivisionEndingDate);

      case 2:
        return !!(this.$$newDivisionCreationWay &&
        this.$$newDivisionCreationNumberX &&
        this.$$newDivisionCreationOrderIsRandom &&
        (!!this.createdGroups || this.newDivisionCreationWay === 'manual'));

      case 3:
        return true; // nista se ne menja, samo pregled

      default:
        return false;

    }

  }

  //endregion

  courses: any[];
  errorMessage: string;

  createdGroups: Array<Array<Student>>;
  divisionTypes: DivisionType;

  private _departmentId: number;

  @Input() set departmentId(departmentId: number) {
    this.resetAll();
    this._departmentId = departmentId;
    this.getCoursesOfDepartment();
  }

  get departmentId(): number {
    return this._departmentId;
  }


  get theme() {
    return this.themeService.getTheme();
  }

  close(message: string = null) {
    this.dialogRef.close(message);
  }

  constructor(private coursesService: CoursesService,
              private divisionsService: DivisionsService,
              private translate: TranslateService,
              private themeService: ThemeService,
              public snackBar: MdSnackBar,
              public dialogRef: MdDialogRef<DivisionCreatorComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
    this.departmentId = data.departmentId;
    this.resetAll();
  }


  private resetAll() {
    this.courses = null;
    this.createdGroups = null;
    this.errorMessage = null;
    this.newDivisionName = '';
    this.newDivisionCourseId = null;
    this.newDivisionBeginningDate = '2017-06-23'; //TODO
    this.newDivisionEndingDate = '2020-04-20'; //TODO
    this.newDivisionTypeId = null;
    this.newDivisionCreationWay = null;
    this.newDivisionCreationNumberX = '12';
    this.newDivisionCreationOrderIsRandom = null;
  }

  ngAfterViewInit() {
    this.getCoursesOfDepartment();
    this.getAllDivisionTypes();
  }

  getCoursesOfDepartment() {
    this.coursesService.getCoursesOfDepartment(this.departmentId)
      .then(
        crs => this.courses = crs,
        error => this.errorMessage = <any>error);
  }

  /**
   * Vrati listu studenata po grupama za prikaz kako ce se grupe napraviti kada se klikne na Submit.
   * Dakle, ovo je za preview. Samo se čitaju studenti iz baze.
   *
   * @param courseId - ID kursa na osnovu kog treba uzeti studente.
   * @param creationWay - Način kreiranja raspodele.
   * @param numberX - Koliko grupa ili koliko studenata, u zavisnosti od creationWay.
   *                  Vrednost se ignorise ukoliko je creationWay postavljen na manual.
   * @param studentsOrder - 0 za redom i 1 za nasumice
   */
  getList(courseId: string, creationWay: string, numberX: string, studentsOrder: '0' | '1'): any {
    console.log('Parametri:', courseId, creationWay, numberX, studentsOrder);
    if (creationWay === 'with_x') {
      this.divisionsService.getGroupsWithX(+courseId, +numberX, +studentsOrder)
        .then(groups => this.createdGroups = groups, error => this.errorMessage = <any>error);
    } else if (creationWay === 'on_x') {
      this.divisionsService.getGroupsOnX(+courseId, +numberX, +studentsOrder)
        .then(groups => this.createdGroups = groups, error => this.errorMessage = <any>error);
    } else {
      console.log('selected_manual_no_list_to_display');
    }
  }

  // Iz look-up tabele
  public getAllDivisionTypes() {
    this.divisionsService.getAllDivisionTypes()
      .then(type => this.divisionTypes = type,
        error => this.errorMessage = <any>error);
  }

  private getNamedGroups() {
    if (!this.createdGroups) {
      return [];
    }
    const ret: Array<any> = [];
    for (let i = 0; i < this.createdGroups.length; i++) {
      ret[i] = {
        name: 'group' + ' ' + (i + 1),
        students: this.createdGroups[i]
      };
    }
    return ret;
  }

  openSnackBar(message: string, action: string = null) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  createInitialDivision() {
    this.divisionsService.createInitialDivision(
      this.newDivisionName,
      this.departmentId,
      +this.newDivisionCourseId,
      +this.newDivisionTypeId,
      this.newDivisionBeginningDateToDate(),
      this.newDivisionEndingDateToDate(),
      this.getNamedGroups()
    )
      .then(response => {
        switch (response.status) {
          case 'success':
            this.openSnackBar(
              this.translate.instant('successfully_created_division__1') + this.newDivisionName +
              this.translate.instant('successfully_created_division__2'));
            this.close('created');
            break;
          default:
            this.openSnackBar(
              this.translate.instant('error') + ' ' +
              this.translate.instant('division_not_created'));
            console.log('error division not created')
            debugger;
            this.close();
            break;
        }
      });
  }

  public numberOfStudents = () => this.createdGroups.map(s => s.length).reduce((p, c) => p + c);
  public averageNumberOfStudents = () => this.numberOfStudents() / this.createdGroups.length;

  public groupPreview = (i, n) => (this.createdGroups[i].slice(0, n)
    .map(e => e.name + ' ' + e.surname + ' (' + e.indexNumber + ')').join(', ').concat('...'));

  public wholeGroupPreview = (i) => (this.createdGroups[i]
    .map((e, n) => (n + 1) + '. ' + e.name + ' ' + e.surname + ' (' + e.indexNumber + ')').join(' \n '));


  preview() {
    this.getList(this.newDivisionCourseId.toString(),
      this.newDivisionCreationWay.toString(),
      this.newDivisionCreationNumberX.toString(),
      this.newDivisionCreationOrderIsRandom);
  }
}
